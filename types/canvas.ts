/**
 * Shared canvas types.
 *
 * All node and edge definitions, type identifiers, color palettes, and shape
 * options live here. Import from this module across client components and
 * background tasks so the canvas schema stays consistent everywhere.
 */

import type { Node, Edge } from "@xyflow/react";

// ---------------------------------------------------------------------------
// Node data
// ---------------------------------------------------------------------------

/** Data carried on every canvas node. */
export interface CanvasNodeData extends Record<string, unknown> {
  /** Display label rendered inside the node. */
  label: string;
  /**
   * Fill color for the node. Must be one of the values from NODE_COLORS.fill.
   * Defaults to the first entry (#1F1F1F) if omitted.
   */
  color: string;
  /**
   * Visual shape of the node. Defaults to "rectangle".
   * Complex shapes (diamond, hexagon, cylinder) are rendered as inline SVGs.
   */
  shape: NodeShape;
}

// ---------------------------------------------------------------------------
// Type identifiers
// ---------------------------------------------------------------------------

/** The single custom node type registered with React Flow. */
export const CANVAS_NODE_TYPE = "canvasNode" as const;

/** The single custom edge type registered with React Flow. */
export const CANVAS_EDGE_TYPE = "canvasEdge" as const;

// ---------------------------------------------------------------------------
// Typed Node / Edge aliases
// ---------------------------------------------------------------------------

/** A typed React Flow node using CanvasNodeData. */
export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>;

/** A typed React Flow edge. */
export type CanvasEdge = Edge<Record<string, unknown>, typeof CANVAS_EDGE_TYPE>;

// ---------------------------------------------------------------------------
// Node color palette
// ---------------------------------------------------------------------------

export interface NodeColorPair {
  /** Dark node fill color. */
  fill: string;
  /** Vivid text color tuned for readability on the fill. */
  text: string;
  /** Human-readable label. */
  label: string;
}

/**
 * 8 defined node color pairs.
 * The first entry is the default (neutral dark).
 * Defined in ui-context.md and duplicated here as the canonical source.
 */
export const NODE_COLORS: NodeColorPair[] = [
  { fill: "#1F1F1F", text: "#EDEDED", label: "Default" },
  { fill: "#10233D", text: "#52A8FF", label: "Blue" },
  { fill: "#2E1938", text: "#BF7AF0", label: "Purple" },
  { fill: "#331B00", text: "#FF990A", label: "Orange" },
  { fill: "#3C1618", text: "#FF6166", label: "Red" },
  { fill: "#3A1726", text: "#F75F8F", label: "Pink" },
  { fill: "#0F2E18", text: "#62C073", label: "Green" },
  { fill: "#062822", text: "#0AC7B4", label: "Teal" },
] as const;

/** Default fill color applied when no color is specified. */
export const DEFAULT_NODE_COLOR = NODE_COLORS[0].fill;

// ---------------------------------------------------------------------------
// Node shapes
// ---------------------------------------------------------------------------

/**
 * All supported node shapes.
 *
 * - `rectangle` — default general-purpose node
 * - `diamond`   — decision / gateway (SVG)
 * - `circle`    — event / endpoint (CSS border-radius)
 * - `pill`      — service / process (CSS border-radius)
 * - `cylinder`  — database / storage (SVG)
 * - `hexagon`   — external system / boundary (SVG)
 */
export type NodeShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

/** All supported shape identifiers for iteration (e.g., palette UIs). */
export const NODE_SHAPES: NodeShape[] = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

/** Default shape applied when no shape is specified. */
export const DEFAULT_NODE_SHAPE: NodeShape = "rectangle";

/**
 * Sensible default dimensions (width and height in px) for each node shape.
 * Used when dragging shapes from the shape panel onto the canvas.
 */
export const DEFAULT_SHAPE_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 120, height: 120 },
  circle: { width: 100, height: 100 },
  pill: { width: 140, height: 60 },
  cylinder: { width: 110, height: 110 },
  hexagon: { width: 120, height: 100 },
};

