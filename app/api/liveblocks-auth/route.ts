/**
 * POST /api/liveblocks-auth
 *
 * Issues a Liveblocks session token for an authenticated Clerk user who has
 * verified access to the requested project (Liveblocks room).
 *
 * Requirements:
 *   1. Clerk authentication is required — returns 401 if not signed in.
 *   2. Project access is verified via the existing `getProjectAccess` helper.
 *   3. The Liveblocks room is created if it does not yet exist.
 *   4. The session token carries user name, avatar, and deterministic cursor color.
 *   5. Returns 403 for authenticated users without project access.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getLiveblocks, getUserCursorColor } from "@/lib/liveblocks";
import { getProjectAccess } from "@/lib/project-access";

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<Response> {
  // 1. Require Clerk authentication.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Resolve the room ID from the request body.
  //    The client sends `{ room: projectId }` as the Liveblocks convention.
  let roomId: string;
  try {
    const body = (await request.json()) as unknown;
    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).room !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid room ID" },
        { status: 400 }
      );
    }
    roomId = (body as Record<string, string>).room;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // 3. Verify the authenticated user has access to this project.
  const { hasAccess } = await getProjectAccess(roomId);
  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 4. Resolve user metadata from Clerk for the session token.
  const user = await currentUser();
  const name =
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const color = getUserCursorColor(userId);

  // 5. Ensure the Liveblocks room exists (create only if needed).
  //    `getOrCreateRoom` is idempotent — safe to call on every auth request.
  const lb = getLiveblocks();
  await lb.getOrCreateRoom(roomId, {
    // Private room — only users with an issued session token can join.
    defaultAccesses: [],
  });

  // 6. Create the session and attach user metadata.
  const session = lb.prepareSession(userId, {
    userInfo: { name, avatar, color },
  });

  // Grant the authenticated user full access to this specific room.
  session.allow(roomId, session.FULL_ACCESS);

  // 7. Authorize and return the signed session token.
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
