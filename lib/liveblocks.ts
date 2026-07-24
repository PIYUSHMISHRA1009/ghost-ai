/**
 * Liveblocks server-side client — shared infrastructure module.
 *
 * Exports:
 *   - `getLiveblocks`: returns the cached Liveblocks node client (lazy, HMR-safe).
 *   - `getUserCursorColor`: maps a Clerk user ID to a deterministic cursor color.
 */

import { Liveblocks } from "@liveblocks/node";

// ---------------------------------------------------------------------------
// Cached singleton client
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var __liveblocksClient: Liveblocks | undefined;
}

function createLiveblocksClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "LIVEBLOCKS_SECRET_KEY is not set. Add it to your .env.local file."
    );
  }
  return new Liveblocks({ secret });
}

/**
 * Returns the cached Liveblocks node client, creating it on first call.
 *
 * Lazy instantiation is intentional: the client must not be created at module
 * evaluation time (which happens during `next build`) because the env var may
 * not be present in the build environment. In development, the instance is
 * stored on globalThis to survive HMR reloads.
 */
export function getLiveblocks(): Liveblocks {
  if (process.env.NODE_ENV === "production") {
    return createLiveblocksClient();
  }
  return (globalThis.__liveblocksClient ??= createLiveblocksClient());
}

// ---------------------------------------------------------------------------
// Cursor color helper
// ---------------------------------------------------------------------------

/**
 * A fixed palette of visually distinct, accessible cursor colors.
 * Colors are chosen to be clearly visible on the dark canvas background.
 */
const CURSOR_COLORS = [
  "#00C8D4", // brand cyan
  "#A855F7", // violet
  "#F97316", // orange
  "#22D3EE", // sky
  "#4ADE80", // green
  "#FACC15", // yellow
  "#F472B6", // pink
  "#60A5FA", // blue
  "#34D399", // emerald
  "#FB7185", // rose
] as const;

/**
 * Maps a Clerk user ID to a consistent cursor color from the fixed palette.
 * Uses a simple djb2-style hash so the same user always gets the same color,
 * regardless of join order or server state.
 */
export function getUserCursorColor(userId: string): string {
  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 33) ^ userId.charCodeAt(i);
  }
  const index = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
}
