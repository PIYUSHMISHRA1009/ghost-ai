"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_SHAPE_SIZES,
  NODE_COLORS,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas";

/**
 * CanvasNodeComponent
 *
 * Custom node renderer for `CANVAS_NODE_TYPE` ("canvasNode").
 * Renders each node according to its explicit shape (`rectangle`, `diamond`,
 * `circle`, `pill`, `cylinder`, `hexagon`) based on `data.shape`.
 * Enforces explicit width and height dimensions and explicit border styling
 * to guarantee all 6 supported shapes render with crisp, non-collapsing geometry.
 */
function CanvasNodeComponentBase({
  data,
  selected,
  width,
  height,
}: NodeProps<CanvasNode>) {
  const shape: NodeShape = data.shape || "rectangle";
  const fillColor = data.color || DEFAULT_NODE_COLOR;
  const colorPair = NODE_COLORS.find((c) => c.fill === fillColor);
  const textColor = colorPair?.text || "#EDEDED";
  const borderColor = selected ? "#00c8d4" : "#3a3a42";

  // Derive explicit dimensions
  const defaultSize = DEFAULT_SHAPE_SIZES[shape] || DEFAULT_SHAPE_SIZES.rectangle;
  const nodeWidth = width || defaultSize.width;
  const nodeHeight = height || defaultSize.height;

  // Render visual geometry based on node shape
  const renderShapeGeometry = () => {
    switch (shape) {
      case "circle":
        return (
          <div
            className="absolute inset-0 transition-all"
            style={{
              backgroundColor: fillColor,
              border: `1.5px solid ${borderColor}`,
              borderRadius: 9999,
              boxShadow: selected
                ? "0 0 0 1px #00c8d4, 0 8px 20px rgba(0, 0, 0, 0.4)"
                : "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          />
        );

      case "pill":
        return (
          <div
            className="absolute inset-0 transition-all"
            style={{
              backgroundColor: fillColor,
              border: `1.5px solid ${borderColor}`,
              borderRadius: 9999,
              boxShadow: selected
                ? "0 0 0 1px #00c8d4, 0 8px 20px rgba(0, 0, 0, 0.4)"
                : "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          />
        );

      case "diamond":
        return (
          <svg
            className="absolute inset-0 h-full w-full transition-all"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50,3 97,50 50,97 3,50"
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={selected ? "2.5" : "1.5"}
            />
          </svg>
        );

      case "hexagon":
        return (
          <svg
            className="absolute inset-0 h-full w-full transition-all"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="25,3 75,3 97,50 75,97 25,97 3,50"
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={selected ? "2.5" : "1.5"}
            />
          </svg>
        );

      case "cylinder":
        return (
          <svg
            className="absolute inset-0 h-full w-full transition-all"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Cylinder Body */}
            <path
              d="M 3 20 L 3 80 C 3 95, 97 95, 97 80 L 97 20 Z"
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={selected ? "2.5" : "1.5"}
            />
            {/* Top Cap */}
            <ellipse
              cx="50"
              cy="20"
              rx="47"
              ry="16"
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={selected ? "2.5" : "1.5"}
            />
          </svg>
        );

      case "rectangle":
      default:
        return (
          <div
            className="absolute inset-0 transition-all"
            style={{
              backgroundColor: fillColor,
              border: `1.5px solid ${borderColor}`,
              borderRadius: 8,
              boxShadow: selected
                ? "0 0 0 1px #00c8d4, 0 8px 20px rgba(0, 0, 0, 0.4)"
                : "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          />
        );
    }
  };

  return (
    <div
      className="group relative flex items-center justify-center select-none"
      style={{
        width: nodeWidth,
        height: nodeHeight,
      }}
    >
      {/* Background Shape Geometry */}
      {renderShapeGeometry()}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      {/* Centered Node Label */}
      <span
        className="relative z-10 px-3 py-1 text-center text-xs font-medium truncate"
        style={{ color: textColor }}
      >
        {data.label || ""}
      </span>
    </div>
  );
}

export const CanvasNodeComponent = memo(CanvasNodeComponentBase);
