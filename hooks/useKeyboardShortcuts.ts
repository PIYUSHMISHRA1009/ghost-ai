"use client";

import { useEffect } from "react";
import type { ReactFlowInstance, Node, Edge } from "@xyflow/react";

export interface UseKeyboardShortcutsOptions<TNodeType extends Node = Node, TEdgeType extends Edge = Edge> {
  reactFlowInstance: ReactFlowInstance<TNodeType, TEdgeType>;
  onUndo: () => void;
  onRedo: () => void;
}

export function useKeyboardShortcuts<TNodeType extends Node = Node, TEdgeType extends Edge = Edge>({
  reactFlowInstance,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsOptions<TNodeType, TEdgeType>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const tagName = target.tagName;
      const isEditable =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isEditable) return;

      const isMod = event.metaKey || event.ctrlKey;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        reactFlowInstance.zoomIn({ duration: 200 });
      } else if (event.key === "-") {
        event.preventDefault();
        reactFlowInstance.zoomOut({ duration: 200 });
      } else if (
        isMod &&
        event.key.toLowerCase() === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        onUndo();
      } else if (
        (isMod && event.shiftKey && event.key.toLowerCase() === "z") ||
        (isMod && event.key.toLowerCase() === "y")
      ) {
        event.preventDefault();
        onRedo();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [reactFlowInstance, onUndo, onRedo]);
}
