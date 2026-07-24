"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import {
  Handle,
  Position,
  NodeResizer,
  NodeToolbar,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { Check } from "lucide-react";
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_SHAPE_SIZES,
  NODE_COLORS,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas";

/** Minimum size boundaries for node resizing */
const MIN_NODE_WIDTH = 60;
const MIN_NODE_HEIGHT = 40;

/**
 * CanvasNodeComponent
 *
 * Custom node renderer for `CANVAS_NODE_TYPE` ("canvasNode").
 * Renders each node according to its explicit shape (`rectangle`, `diamond`,
 * `circle`, `pill`, `cylinder`, `hexagon`) based on `data.shape`.
 * Enforces explicit width and height dimensions and high-contrast border styling
 * so all 6 supported shapes render with crisp, crystal-clear geometry over the dark canvas.
 *
 * Features:
 *   - Node resizing with subtle cyan handles when selected (min 60x40)
 *   - Floating color toolbar to customize node fill and matching text colors
 *   - Inline label editing via double-click with centered textarea
 *   - Live sync of label & color edits with Liveblocks via `setNodes`
 *   - Canvas drag/pan prevention (`nodrag nopan`) during toolbar/editing interactions
 */
function CanvasNodeComponentBase({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps<CanvasNode>) {
  const shape: NodeShape = data.shape || "rectangle";
  const fillColor = data.color || DEFAULT_NODE_COLOR;
  const colorPair = NODE_COLORS.find((c) => c.fill === fillColor);
  const textColor = colorPair?.text || "#EDEDED";

  // High-contrast subtle border at rest (#4a4a56) and cyan glow (#00c8d4) when selected
  const borderColor = selected ? "#00c8d4" : "#4a4a56";

  // Derive explicit dimensions
  const defaultSize = DEFAULT_SHAPE_SIZES[shape] || DEFAULT_SHAPE_SIZES.rectangle;
  const nodeWidth = width || defaultSize.width;
  const nodeHeight = height || defaultSize.height;

  // React Flow instance for node state mutation
  const { setNodes } = useReactFlow<CanvasNode>();

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus and auto-select text when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Adjust textarea height on input change
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, data.label]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleColorSelect = useCallback(
    (newColor: string) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                color: newColor,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newLabel = e.target.value;
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setIsEditing(false);
      }
    },
    []
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Render visual geometry based on node shape
  const renderShapeGeometry = () => {
    switch (shape) {
      case "circle":
      case "pill":
        return (
          <div
            className="absolute inset-0 h-full w-full transition-all"
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
            className="absolute inset-0 h-full w-full transition-all overflow-visible"
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
            className="absolute inset-0 h-full w-full transition-all overflow-visible"
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
            className="absolute inset-0 h-full w-full transition-all overflow-visible"
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
            className="absolute inset-0 h-full w-full transition-all"
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
      onDoubleClick={handleDoubleClick}
    >
      {/* Floating Color Toolbar for selected nodes */}
      <NodeToolbar
        nodeId={id}
        isVisible={!!selected && !isEditing}
        position={Position.Top}
        offset={16}
        className="nodrag nopan flex items-center gap-5 rounded-2xl border border-[#2a2a30] bg-[#111114]/95 px-8 py-6 shadow-2xl backdrop-blur-md"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {NODE_COLORS.map((color) => {
          const isActive = (data.color || DEFAULT_NODE_COLOR) === color.fill;
          return (
            <button
              key={color.fill}
              type="button"
              title={color.label}
              onClick={() => handleColorSelect(color.fill)}
              className={`group relative h-[52px] w-[52px] rounded-xl border transition-all duration-150 flex items-center justify-center cursor-pointer ${
                isActive
                  ? "border-white ring-2 ring-[#00c8d4] ring-offset-2 ring-offset-[#111114] scale-110 z-10 shadow-lg"
                  : "border-[#3a3a42] hover:scale-110"
              }`}
              style={{
                backgroundColor: color.fill,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 14px 4px ${color.text}80`;
                e.currentTarget.style.borderColor = color.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isActive
                  ? `0 0 10px 2px ${color.text}50`
                  : "none";
                e.currentTarget.style.borderColor = isActive
                  ? "#ffffff"
                  : "#3a3a42";
              }}
            >
              {isActive && (
                <Check
                  className="h-7 w-7 text-white drop-shadow-md"
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </NodeToolbar>

      {/* Node Resizer Control for selected nodes */}
      <NodeResizer
        isVisible={!!selected}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        color="#00c8d4"
        handleClassName="!w-2 !h-2 !bg-[#00c8d4] !border !border-[#111114] !rounded-xs opacity-90 hover:scale-125 transition-transform"
        lineClassName="!border-[#00c8d4] opacity-40"
      />

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
        position={Position.Top}
        id="top-source"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
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
        position={Position.Bottom}
        id="bottom-target"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!z-20 !h-2.5 !w-2.5 !border-2 !border-[#111114] !bg-white opacity-0 transition-opacity group-hover:opacity-100"
      />

      {/* Centered Node Label / Textarea */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={data.label || ""}
          onChange={handleLabelChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          placeholder="Type a label..."
          rows={1}
          className="nodrag nopan relative z-30 max-w-[85%] max-h-[80%] resize-none overflow-hidden bg-transparent px-2 py-1 text-center text-xs font-medium outline-none border-none shadow-none focus:outline-none focus:ring-0 placeholder:opacity-40 placeholder:italic"
          style={{
            color: textColor,
            caretColor: textColor,
          }}
        />
      ) : (
        <span
          className="relative z-10 max-w-[85%] max-h-[85%] px-2 py-1 text-center text-xs font-medium break-words select-none cursor-text overflow-hidden"
          style={{ color: textColor }}
          title={data.label || "Type a label..."}
        >
          {data.label ? (
            data.label
          ) : (
            <span className="opacity-40 italic">Type a label...</span>
          )}
        </span>
      )}
    </div>
  );
}

export const CanvasNodeComponent = memo(CanvasNodeComponentBase);

