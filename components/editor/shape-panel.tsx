"use client";

import { useCallback } from "react";
import { Panel } from "@xyflow/react";
import {
  RectangleHorizontal,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import {
  DEFAULT_SHAPE_SIZES,
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
 * ShapePanel
 *
 * Floating pill-shaped toolbar positioned at bottom-center of the React Flow canvas.
 * Uses React Flow's `<Panel>` component so it stays correctly layered and visible
 * over the canvas viewport. Renders draggable shape items for all 6 canvas shapes.
 */
export function ShapePanel() {
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
            title={`Drag ${label} onto canvas`}
            aria-label={`Drag ${label} shape`}
            style={{
              display: "flex",
              height: 36,
              width: 36,
              cursor: "grab",
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
