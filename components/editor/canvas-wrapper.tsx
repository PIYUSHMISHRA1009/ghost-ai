"use client";

/**
 * CanvasWrapper
 *
 * Sets up the Liveblocks room for a given project and renders the React Flow
 * canvas inside it.
 *
 * Provider hierarchy:
 *   LiveblocksProvider (auth)
 *     └─ RoomProvider (room = projectId)
 *          └─ ErrorBoundary (Liveblocks connection errors)
 *               └─ ClientSideSuspense (loading state)
 *                    └─ CanvasFlow (React Flow + useLiveblocksFlow)
 */

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { ReactFlowProvider } from "@xyflow/react";
import { ErrorBoundary } from "react-error-boundary";
import { AlertTriangle, Loader2 } from "lucide-react";

import { CanvasFlow } from "@/components/editor/canvas-flow";

interface CanvasWrapperProps {
  /** The project ID — used as the Liveblocks room ID. */
  roomId: string;
}

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

function CanvasLoading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        background: "#0b0c10",
      }}
    >
      <Loader2
        style={{
          width: 28,
          height: 28,
          color: "#00c8d4",
          animation: "spin 1s linear infinite",
        }}
      />
      <span style={{ fontSize: 12, color: "#505060" }}>
        Connecting to room…
      </span>
      {/* Inline keyframes — avoids a global CSS side-effect */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function CanvasError() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        background: "#0b0c10",
      }}
    >
      <AlertTriangle
        style={{ width: 28, height: 28, color: "#ff4d4f" }}
      />
      <span style={{ fontSize: 13, color: "#c0c0cc", fontWeight: 600 }}>
        Could not connect to the canvas
      </span>
      <span style={{ fontSize: 12, color: "#505060", maxWidth: 300, textAlign: "center" }}>
        There was a problem connecting to the collaboration room. Refresh the
        page to try again.
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CanvasWrapper
// ---------------------------------------------------------------------------

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <ErrorBoundary
          fallback={<CanvasError />}
          onError={(error) => {
            console.error("Liveblocks room connection error:", error);
          }}
        >
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <ReactFlowProvider>
              <CanvasFlow />
            </ReactFlowProvider>
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

