"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseCanvasAutosaveProps {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
}: UseCanvasAutosaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const lastSavedJsonRef = useRef<string>("");
  const isInitializedRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(
    async (currentNodes: CanvasNode[], currentEdges: CanvasEdge[]) => {
      const payloadString = JSON.stringify({
        nodes: currentNodes,
        edges: currentEdges,
      });

      // Avoid redundant saves if content hasn't changed
      if (payloadString === lastSavedJsonRef.current) {
        return;
      }

      setSaveStatus("saving");

      try {
        const response = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: payloadString,
        });

        if (!response.ok) {
          let details = response.statusText;
          try {
            const errorJson = (await response.json()) as { error?: string; details?: string };
            details = errorJson.details || errorJson.error || response.statusText;
          } catch {}
          throw new Error(`Failed to save canvas: ${details}`);
        }

        lastSavedJsonRef.current = payloadString;
        setSaveStatus("saved");
      } catch (error) {
        console.error("Canvas autosave error:", error);
        setSaveStatus("error");
      }
    },
    [projectId]
  );

  // Auto-save debounced effect
  useEffect(() => {
    const currentPayloadString = JSON.stringify({ nodes, edges });

    // On initial load, capture initial baseline without triggering save
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      lastSavedJsonRef.current = currentPayloadString;
      return;
    }

    if (currentPayloadString === lastSavedJsonRef.current) {
      return;
    }

    setSaveStatus("saving");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave(nodes, edges);
    }, 1500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [nodes, edges, performSave]);

  // Manual save callback
  const triggerManualSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSave(nodes, edges);
  }, [nodes, edges, performSave]);

  return {
    saveStatus,
    triggerManualSave,
  };
}
