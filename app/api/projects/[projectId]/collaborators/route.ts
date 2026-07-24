import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

interface InviteBody {
  email?: string;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const user = await currentUser();
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "";

  const isOwner = project.ownerId === userId;
  const isCollaborator =
    Boolean(primaryEmail) &&
    project.collaborators.some(
      (c) => c.email.toLowerCase() === primaryEmail.toLowerCase()
    );

  if (!isOwner && !isCollaborator) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const client = await clerkClient();

  // 1. Fetch Owner Clerk Info
  const ownerUser = await client.users.getUser(project.ownerId).catch(() => null);
  const ownerEmail =
    ownerUser?.primaryEmailAddress?.emailAddress ??
    ownerUser?.emailAddresses?.[0]?.emailAddress ??
    "";
  const ownerName = ownerUser
    ? `${ownerUser.firstName ?? ""} ${ownerUser.lastName ?? ""}`.trim() ||
      ownerUser.username ||
      ownerEmail
    : "Project Owner";
  const ownerAvatarUrl = ownerUser?.imageUrl ?? null;

  // 2. Fetch Collaborators Clerk Profiles
  const collaboratorEmails = project.collaborators.map((c) => c.email);
  const clerkUsersMap = new Map<string, { firstName?: string | null; lastName?: string | null; username?: string | null; imageUrl?: string }>();

  if (collaboratorEmails.length > 0) {
    try {
      const clerkUsersResponse = await client.users.getUserList({
        emailAddress: collaboratorEmails,
      });

      for (const cu of clerkUsersResponse.data) {
        for (const ea of cu.emailAddresses) {
          clerkUsersMap.set(ea.emailAddress.toLowerCase(), {
            firstName: cu.firstName,
            lastName: cu.lastName,
            username: cu.username,
            imageUrl: cu.imageUrl,
          });
        }
      }
    } catch {
      // Ignore Clerk API failures and fallback to null profile info
    }
  }

  const collaborators = project.collaborators.map((c) => {
    const clerkUser = clerkUsersMap.get(c.email.toLowerCase());
    const name = clerkUser
      ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
        clerkUser.username ||
        c.email
      : null;
    const avatarUrl = clerkUser?.imageUrl ?? null;

    return {
      id: c.id,
      email: c.email,
      name,
      avatarUrl,
      createdAt: c.createdAt,
    };
  });

  return NextResponse.json({
    isOwner,
    owner: {
      id: project.ownerId,
      email: ownerEmail,
      name: ownerName,
      avatarUrl: ownerAvatarUrl,
    },
    collaborators,
  });
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      { error: "Forbidden: Only the project owner can invite collaborators" },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as InviteBody | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email || !isValidEmail) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 }
    );
  }

  const client = await clerkClient();
  const ownerUser = await client.users.getUser(project.ownerId).catch(() => null);
  const ownerEmails =
    ownerUser?.emailAddresses.map((e) => e.emailAddress.toLowerCase()) ?? [];

  if (ownerEmails.includes(email)) {
    return NextResponse.json(
      { error: "Cannot invite the project owner as a collaborator" },
      { status: 400 }
    );
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email,
      },
    });

    let name: string | null = null;
    let avatarUrl: string | null = null;

    try {
      const usersResponse = await client.users.getUserList({
        emailAddress: [email],
      });
      const clerkUser = usersResponse.data?.[0];
      if (clerkUser) {
        name =
          `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
          clerkUser.username ||
          email;
        avatarUrl = clerkUser.imageUrl;
      }
    } catch {
      // Ignore Clerk API failures and fallback
    }

    return NextResponse.json(
      {
        id: collaborator.id,
        email: collaborator.email,
        name,
        avatarUrl,
        createdAt: collaborator.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return NextResponse.json(
        { error: "User is already a collaborator" },
        { status: 409 }
      );
    }
    throw error;
  }
}
