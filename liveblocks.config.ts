/**
 * Liveblocks global type configuration.
 *
 * Defines Presence and UserMeta shapes used across the app.
 * Import this file in any module that needs Liveblocks types to be resolved;
 * the global augmentation takes effect project-wide once loaded.
 */

declare global {
  interface Liveblocks {
    /**
     * Each user's ephemeral presence — broadcast to everyone in the room.
     * Reset to initial values on disconnect.
     */
    Presence: {
      /** Canvas pointer coordinates, or null when the cursor is off-canvas. */
      cursor: { x: number; y: number } | null;
      /** True while the AI is generating output on behalf of this user. */
      thinking: boolean;
      /** Backward compatibility flag for AI thinking status. */
      isThinking?: boolean;
    };

    /**
     * Persistent user metadata attached to the Liveblocks session token.
     * Available via useSelf, useOthers, etc.
     */
    UserMeta: {
      /** Clerk user ID. */
      id: string;
      info: {
        /** Display name (Clerk full name or primary email). */
        name: string;
        /** Avatar image URL from Clerk. */
        avatar: string;
        /** Deterministic cursor color derived from the user ID. */
        color: string;
      };
    };

    // Unused for now — kept as empty stubs so TypeScript doesn't complain.
    Storage: Record<string, never>;
    RoomEvent: Record<string, never>;
    ThreadMetadata: Record<string, never>;
    RoomInfo: Record<string, never>;
    GroupInfo: Record<string, never>;
    ActivitiesData: Record<string, never>;
  }
}

// Necessary because this file has no top-level imports or exports.
export {};
