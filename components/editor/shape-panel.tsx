"use client";

import { useCallback } from "react";
import { Panel, useReactFlow } from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  RectangleHorizontal,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import {
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  DEFAULT_SHAPE_SIZES,
  type CanvasNode,
  type CanvasEdge,
  type NodeShape,
} from "@/types/canvas";

interface ShapeConfig {
  shape: NodeShape;
  label: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
}

const SHAPE_CONFIGS: ShapeConfig[] = [
  {
    shape: "rectangle",
    label: "Rectangle",
    icon: RectangleHorizontal,
  },
  {
    shape: "diamond",
    label: "Diamond",
    icon: Diamond,
  },
  {
    shape: "circle",
    label: "Circle",
    icon: Circle,
  },
  {
    shape: "pill",
    label: "Pill",
    icon: Pill,
  },
  {
    shape: "cylinder",
    label: "Cylinder",
    icon: Cylinder,
  },
  {
    shape: "hexagon",
    label: "Hexagon",
    icon: Hexagon,
  },
];

/**
 * Creates a temporary DOM element representing the ghost drag preview of a shape.
 * Used by HTML5 `event.dataTransfer.setDragImage` to attach a ghost shape preview
 * to the cursor during drag.
 */
function createShapeDragPreview(shape: NodeShape): HTMLElement {
  const size = DEFAULT_SHAPE_SIZES[shape];
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = `${size.width}px`;
  container.style.height = `${size.height}px`;
  container.style.opacity = "0.75";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  if (shape === "circle" || shape === "pill") {
    container.style.backgroundColor = "#1F1F1F";
    container.style.border = "1.5px solid #00c8d4";
    container.style.borderRadius = "9999px";
    container.style.boxShadow = "0 8px 24px rgba(0, 200, 212, 0.3)";
  } else if (shape === "rectangle") {
    container.style.backgroundColor = "#1F1F1F";
    container.style.border = "1.5px solid #00c8d4";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 8px 24px rgba(0, 200, 212, 0.3)";
  } else if (shape === "diamond") {
    container.innerHTML = `
      <svg width="${size.width}" height="${size.height}" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,3 97,50 50,97 3,50" fill="#1F1F1F" stroke="#00c8d4" stroke-width="2" />
      </svg>
    `;
  } else if (shape === "hexagon") {
    container.innerHTML = `
      <svg width="${size.width}" height="${size.height}" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="25,3 75,3 97,50 75,97 25,97 3,50" fill="#1F1F1F" stroke="#00c8d4" stroke-width="2" />
      </svg>
    `;
  } else if (shape === "cylinder") {
    container.innerHTML = `
      <svg width="${size.width}" height="${size.height}" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 3 20 L 3 80 C 3 95, 97 95, 97 80 L 97 20 Z" fill="#1F1F1F" stroke="#00c8d4" stroke-width="2" />
        <ellipse cx="50" cy="20" rx="47" ry="16" fill="#1F1F1F" stroke="#00c8d4" stroke-width="2" />
      </svg>
    `;
  }

  document.body.appendChild(container);
  return container;
}

/**
 * ShapePanel
 *
 * Floating pill-shaped toolbar positioned at bottom-center of the React Flow canvas.
 * Uses React Flow's `<Panel>` component so it stays correctly layered and visible
 * over the canvas viewport. Renders draggable shape items for all 6 canvas shapes,
 * supporting dragging onto canvas or clicking / Enter key activation.
 */
export function ShapePanel() {
  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>();
  const { onNodesChange } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
  });

  const handleAddShapeAtCenter = useCallback(
    (shape: NodeShape) => {
      const size = DEFAULT_SHAPE_SIZES[shape];
      const viewport = reactFlowInstance.getViewport();
      const zoom = viewport.zoom || 1;
      const centerX = (-viewport.x + (typeof window !== "undefined" ? window.innerWidth / 2 : 400)) / zoom;
      const centerY = (-viewport.y + (typeof window !== "undefined" ? window.innerHeight / 2 : 300)) / zoom;

      const newNode: CanvasNode = {
        id: `${shape}_${crypto.randomUUID()}`,
        type: CANVAS_NODE_TYPE,
        position: {
          x: centerX - size.width / 2,
          y: centerY - size.height / 2,
        },
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape: shape,
        },
        width: size.width,
        height: size.height,
        style: { width: size.width, height: size.height },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [reactFlowInstance, onNodesChange]
  );

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, shape: NodeShape) => {
      const size = DEFAULT_SHAPE_SIZES[shape];
      const payload = JSON.stringify({
        shape,
        width: size.width,
        height: size.height,
      });

      event.dataTransfer.setData("application/reactflow", payload);
      event.dataTransfer.setData("text/plain", payload);
      event.dataTransfer.effectAllowed = "move";

      // Attach ghost shape preview centered at the cursor
      const ghostEl = createShapeDragPreview(shape);
      event.dataTransfer.setDragImage(ghostEl, size.width / 2, size.height / 2);

      // Clean up temporary element after browser captures preview image
      setTimeout(() => {
        if (ghostEl.parentNode) {
          ghostEl.parentNode.removeChild(ghostEl);
        }
      }, 0);
    },
    []
  );

  return (
    <Panel position="bottom-center" style={{ marginBottom: 20, zIndex: 1000 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          borderRadius: 9999,
          border: "1px solid #2a2a30",
          backgroundColor: "rgba(17, 17, 20, 0.95)",
          padding: "6px 12px",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          pointerEvents: "auto",
        }}
      >
        {SHAPE_CONFIGS.map(({ shape, label, icon: Icon }) => (
          <div
            key={shape}
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            onClick={() => handleAddShapeAtCenter(shape)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAddShapeAtCenter(shape);
              }
            }}
            title={`Add ${label} shape (click or drag onto canvas)`}
            aria-label={`Add ${label} shape`}
            style={{
              display: "flex",
              height: 36,
              width: 36,
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9999,
              border: "none",
              backgroundColor: "transparent",
              color: "#808090",
              transition: "all 0.15s ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#18181c";
              e.currentTarget.style.color = "#f0f0f4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#808090";
            }}
          >
            <Icon style={{ width: 16, height: 16, pointerEvents: "none" }} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
