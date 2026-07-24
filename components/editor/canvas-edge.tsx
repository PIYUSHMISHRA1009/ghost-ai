"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { CANVAS_EDGE_TYPE } from "@/types/canvas";

function CanvasEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  selected,
  data,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { setEdges } = useReactFlow();

  const label = (data as { label?: string } | undefined)?.label || "";

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(label);
  }, [label]);

  const handleSave = useCallback(() => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, label: editValue } }
          : edge
      )
    );
    setIsEditing(false);
  }, [id, editValue, setEdges]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
        setEditValue(label);
      }
    },
    [handleSave, label]
  );

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  const strokeColor = selected ? "#00c8d4" : isHovered ? "#c0c0cc" : "#4a4a56";
  const markerColor = strokeColor;
  const markerId = `arrow-${id}`;

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: selected || isHovered ? 2 : 1.5,
          strokeLinecap: "round",
        }}
        markerEnd={`url(#${markerId})`}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-[#111114] border border-[#2a2a30] text-copy-primary text-xs rounded px-2 py-1 outline-none focus:border-brand min-w-[60px]"
              placeholder="Edge label"
            />
          ) : label ? (
            <div className="bg-[#18181c] border border-[#2a2a30] text-copy-secondary text-[10px] px-2 py-0.5 rounded-full select-none">
              {label}
            </div>
          ) : selected ? (
            <div className="text-[#505060] text-[10px] italic pointer-events-none">
              Double-click to add label
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={markerColor} />
        </marker>
      </defs>
    </>
  );
}

export { CanvasEdge, CANVAS_EDGE_TYPE };