"use client";

/**
 * CanvasFlow
 *
 * The inner canvas component. Must be rendered inside:
 *   LiveblocksProvider → RoomProvider → ClientSideSuspense → ReactFlowProvider
 *
 * Uses `useLiveblocksFlow` with suspense:true so node/edge state is fully
 * loaded before this component renders. Renders a React Flow canvas with:
 *   - Liveblocks-synced nodes and edges
 *   - Custom `canvasNode` type renderer
 *   - Drag-and-drop shape panel for adding nodes
 *   - Loose connection behavior (connectOnClick)
 *   - fitView on mount
 *   - MiniMap
 *   - Dot-pattern background
 *   - Live cursors via <Cursors />
 */

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";

import {
  CANVAS_NODE_TYPE,
  CANVAS_EDGE_TYPE,
  DEFAULT_NODE_COLOR,
  type CanvasNode,
  type CanvasEdge,
  type NodeShape,
} from "@/types/canvas";
import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";

// Module-level counter for node ID generation (spec #6)
let nodeCounter = 0;

// Node / edge type maps
const nodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeComponent,
};

const edgeTypes = {} as Record<typeof CANVAS_EDGE_TYPE, React.ComponentType>;

export function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>();

  // Prevent default context menu on nodes (reserved for future node toolbar).
  const onNodeContextMenu = useCallback<NodeMouseHandler>(
    (event) => event.preventDefault(),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const rawPayload =
        event.dataTransfer.getData("application/reactflow") ||
        event.dataTransfer.getData("text/plain");
      if (!rawPayload) return;

      try {
        const payload = JSON.parse(rawPayload) as {
          shape: NodeShape;
          width: number;
          height: number;
        };

        const { shape, width, height } = payload;
        if (!shape) return;

        // Convert screen position to canvas coordinates
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        nodeCounter += 1;
        const newNode: CanvasNode = {
          id: `${shape}_${Date.now()}_${nodeCounter}`,
          type: CANVAS_NODE_TYPE,
          position: {
            x: position.x - width / 2,
            y: position.y - height / 2,
          },
          data: {
            label: "",
            color: DEFAULT_NODE_COLOR,
            shape: shape,
          },
          width: width,
          height: height,
          style: { width, height },
        };

        // Notify Liveblocks flow sync and React Flow instance
        onNodesChange([{ type: "add", item: newNode }]);
        reactFlowInstance.addNodes(newNode);
      } catch (error) {
        console.error("Error handling canvas shape drop:", error);
      }
    },
    [reactFlowInstance, onNodesChange]
  );

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onNodeContextMenu={onNodeContextMenu}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes as never}
        connectOnClick
        fitView
        style={{ background: "transparent" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2a2a30"
        />

        <MiniMap
          style={{
            backgroundColor: "#111114",
            border: "1px solid #2a2a30",
          }}
          maskColor="rgba(8,8,9,0.6)"
          nodeColor="#3a3a42"
        />

        <Cursors />

        {/* Floating shape panel toolbar at bottom center */}
        <ShapePanel />
      </ReactFlow>
    </div>
  );
}
