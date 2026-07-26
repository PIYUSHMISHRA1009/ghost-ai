"use client";

import { useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useOthers } from "@liveblocks/react";

/**
 * Computes up to 2 uppercase initials from a full name or email string.
 */
function getInitials(name?: string): string {
  if (!name) return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

/**
 * CollaboratorAvatar
 *
 * Renders a single display-only collaborator avatar. Uses the user's profile
 * picture if available, falling back to uppercase initials on image error or missing URL.
 */
function CollaboratorAvatar({
  name,
  avatar,
  color,
}: {
  name?: string;
  avatar?: string;
  color?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const displayName = name || "Collaborator";

  return (
    <div
      title={displayName}
      className="relative flex-shrink-0 h-[30px] w-[30px] rounded-lg ring-2 ring-[#0b0c10] overflow-hidden select-none"
      style={{ backgroundColor: color || "#2a2a30" }}
    >
      {avatar && !imageError ? (
        <img
          src={avatar}
          alt={displayName}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover rounded-lg"
        />
      ) : (
        <div
          className="h-full w-full flex items-center justify-center text-[11px] font-bold text-white rounded-lg"
          style={{ backgroundColor: color || "#3a3a42" }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

/**
 * PresenceAvatars
 *
 * Renders the active room participants group inside the top-right corner of the editor canvas area.
 * - Displays collaborator avatars (up to 5 in an overlapping stack) excluding the current user.
 * - Renders a +N overflow badge if more than 5 collaborators are connected.
 * - Shows a divider between collaborators and the Clerk UserButton ONLY when at least 1 collaborator exists.
 * - Displays the current user's Clerk UserButton.
 */
export function PresenceAvatars() {
  const { user: clerkUser } = useUser();
  const currentUserId = clerkUser?.id;
  const others = useOthers();

  // Filter out any Liveblocks presence entry matching the current Clerk user ID
  const collaborators = others.filter(
    (other) => other.id !== currentUserId && other.info
  );

  const visibleCollaborators = collaborators.slice(0, 5);
  const overflowCount = collaborators.length - visibleCollaborators.length;

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111114]/90 backdrop-blur-sm border border-[#2a2a30] shadow-xl pointer-events-auto">
      {/* Collaborator Avatars */}
      {visibleCollaborators.length > 0 && (
        <div className="flex items-center -space-x-1.5">
          {visibleCollaborators.map((other) => (
            <CollaboratorAvatar
              key={other.connectionId}
              name={other.info?.name}
              avatar={other.info?.avatar}
              color={other.info?.color}
            />
          ))}

          {/* +N Overflow Chip */}
          {overflowCount > 0 && (
            <div
              title={`+${overflowCount} more collaborators`}
              className="flex-shrink-0 h-[30px] w-[30px] rounded-lg bg-[#1e1e23] border border-[#2a2a30] ring-2 ring-[#0b0c10] text-[#c0c0cc] text-[11px] font-semibold flex items-center justify-center select-none"
            >
              +{overflowCount}
            </div>
          )}
        </div>
      )}

      {/* Divider — render ONLY when at least 1 collaborator exists */}
      {collaborators.length > 0 && (
        <span className="h-4 w-[1px] bg-[#2a2a30] mx-0.5 flex-shrink-0" />
      )}

      {/* Current User Clerk Avatar */}
      <UserButton
        appearance={{
          elements: {
            rootBox: "flex items-center",
            userButtonTrigger:
              "focus:shadow-none focus-visible:ring-2 focus-visible:ring-[#00c8d4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111114] outline-none rounded-lg",
            avatarBox:
              "h-[30px] w-[30px] rounded-lg ring-1 ring-white/10 hover:ring-white/25 transition-all",
            userButtonPopoverCard:
              "bg-[#111114] border border-[#2a2a30] shadow-2xl rounded-xl",
            userButtonPopoverActionButton: "hover:bg-[#1e1e23] rounded-lg",
            userButtonPopoverActionButtonText: "text-[13px] text-[#c0c0cc]",
            userButtonPopoverActionButtonIcon: "text-[#808090]",
            userPreviewMainIdentifier: "text-[14px] font-medium text-[#f0f0f4]",
            userPreviewSecondaryIdentifier: "text-[12px] text-[#808090]",
            userButtonPopoverFooter: "hidden",
          },
        }}
      />
    </div>
  );
}
