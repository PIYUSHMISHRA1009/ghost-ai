"use client";

import React, { useCallback, MouseEvent } from "react";
import { useReactFlow, Panel } from "@xyflow/react";
import { useCanUndo, useCanRedo, useUndo, useRedo } from "@liveblocks/react";
import { Minus, Maximize, Plus, Undo2, Redo2 } from "lucide-react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const ICON_SIZE = 16;

const BUTTON_STYLE = {
  display: "flex",
  height: 32,
  width: 32,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9999,
  border: "none",
  backgroundColor: "transparent",
  color: "#808090",
  transition: "all 0.15s ease",
  cursor: "pointer",
  userSelect: "none",
  padding: 0,
} as const;

export function CanvasControls() {
  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const undo = useUndo();
  const redo = useRedo();

  useKeyboardShortcuts({
    reactFlowInstance,
    onUndo: undo,
    onRedo: redo,
  });

  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn({ duration: 200 });
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut({ duration: 200 });
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ duration: 200 });
  }, [reactFlowInstance]);

  const handleUndo = useCallback(() => {
    if (canUndo) undo();
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) redo();
  }, [canRedo, redo]);

  return (
    <Panel position="bottom-left" style={{ marginBottom: 20, marginLeft: 16, zIndex: 1001 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          borderRadius: 9999,
          border: "1px solid #2a2a30",
          backgroundColor: "rgba(17, 17, 20, 0.95)",
          padding: "6px 12px",
          boxShadow:
            "0 16px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <ControlButton
          onClick={handleZoomOut}
          title="Zoom out"
          ariaLabel="Zoom out"
        >
          <Minus width={ICON_SIZE} height={ICON_SIZE} />
        </ControlButton>
        <ControlButton
          onClick={handleFitView}
          title="Fit view"
          ariaLabel="Fit view"
        >
          <Maximize width={ICON_SIZE} height={ICON_SIZE} />
        </ControlButton>
        <ControlButton
          onClick={handleZoomIn}
          title="Zoom in"
          ariaLabel="Zoom in"
        >
          <Plus width={ICON_SIZE} height={ICON_SIZE} />
        </ControlButton>

        <div
          style={{
            width: 1,
            height: 16,
            backgroundColor: "#2a2a30",
            margin: "0 4px",
          }}
        />

        <ControlButton
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo"
          ariaLabel="Undo"
        >
          <Undo2 width={ICON_SIZE} height={ICON_SIZE} />
        </ControlButton>
        <ControlButton
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo"
          ariaLabel="Redo"
        >
          <Redo2 width={ICON_SIZE} height={ICON_SIZE} />
        </ControlButton>
      </div>
    </Panel>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

function ControlButton({
  onClick,
  disabled,
  title,
  ariaLabel,
  children,
}: ControlButtonProps) {
  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        event.currentTarget.style.backgroundColor = "#18181c";
        event.currentTarget.style.color = "#f0f0f4";
      }
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.style.backgroundColor = "transparent";
      event.currentTarget.style.color = "#808090";
    },
    []
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      style={{
        ...BUTTON_STYLE,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : BUTTON_STYLE.cursor,
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
