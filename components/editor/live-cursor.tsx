"use client";

import { useOther } from "@liveblocks/react";
import type { CursorsCursorProps } from "@liveblocks/react-flow";

/**
 * CustomLiveCursor
 *
 * Renders a collaborator's live canvas cursor pointer with an attached display name badge.
 * Uses the collaborator's deterministic presence color (`info.color`).
 */
export function CustomLiveCursor({ connectionId }: CursorsCursorProps) {
  const info = useOther(connectionId, (other) => other.info);

  const color = info?.color || "#00c8d4";
  const name = info?.name || "Collaborator";

  return (
    <div className="flex items-center gap-1 pointer-events-none select-none">
      {/* SVG Pointer Arrow */}
      <svg
        className="h-5 w-5 drop-shadow-md flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.5 16.8829L0.5 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
          stroke="#0b0c10"
          strokeWidth="1"
        />
      </svg>

      {/* Name Badge */}
      <div
        className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-white shadow-lg whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  );
}
