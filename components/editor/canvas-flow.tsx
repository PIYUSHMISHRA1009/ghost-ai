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

import { useCallback, useImperativeHandle, forwardRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
  type Connection,
  type NodeChange,
  type EdgeChange,
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
import { CanvasEdge as CanvasEdgeComponent } from "@/components/editor/canvas-edge";
import { ShapePanel } from "@/components/editor/shape-panel";
import { CanvasControls } from "@/components/editor/canvas-controls";
import { type CanvasTemplate } from "@/components/editor/starter-templates";

export interface CanvasFlowHandle {
  importTemplate: (template: CanvasTemplate) => void;
}

// Node type map registered with React Flow
const nodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeComponent,
};

const edgeTypes = {
  [CANVAS_EDGE_TYPE]: CanvasEdgeComponent,
};

export const CanvasFlow = forwardRef<CanvasFlowHandle, object>(
  function CanvasFlow(_props, ref) {
    const { nodes, edges, onNodesChange, onEdgesChange, onDelete } =
      useLiveblocksFlow<CanvasNode, CanvasEdge>({
        suspense: true,
        nodes: { initial: [] },
        edges: { initial: [] },
      });

    const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>();

    const handleImportTemplate = useCallback(
      (template: CanvasTemplate) => {
        if (!onNodesChange || !onEdgesChange || !reactFlowInstance) return;

        const removeNodes: { type: "remove"; id: string }[] = nodes.map((n) => ({ type: "remove", id: n.id }));
        const removeEdges: { type: "remove"; id: string }[] = edges.map((e) => ({ type: "remove", id: e.id }));
        const addNodes: { type: "add"; item: CanvasNode }[] = template.nodes.map((n) => ({ type: "add", item: n }));
        const addEdges: { type: "add"; item: CanvasEdge }[] = template.edges.map((e) => ({ type: "add", item: e }));

        onNodesChange([...removeNodes, ...addNodes] as NodeChange<CanvasNode>[]);
        onEdgesChange([...removeEdges, ...addEdges] as EdgeChange<CanvasEdge>[]);

        requestAnimationFrame(() => {
          reactFlowInstance.fitView({ duration: 200 });
        });
      },
      [nodes, edges, onNodesChange, onEdgesChange, reactFlowInstance]
    );

    useImperativeHandle(
      ref,
      () => ({
        importTemplate: handleImportTemplate,
      }),
      [handleImportTemplate]
    );

    const handleConnect = useCallback(
      (connection: Connection) => {
        onEdgesChange([
          {
            type: "add",
            item: {
              id: `${connection.source}-${connection.target}-${crypto.randomUUID()}`,
              source: connection.source,
              target: connection.target,
              sourceHandle: connection.sourceHandle,
              targetHandle: connection.targetHandle,
              type: CANVAS_EDGE_TYPE,
            },
          },
        ]);
      },
      [onEdgesChange]
    );

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

          const newNode: CanvasNode = {
            id: `${shape}_${crypto.randomUUID()}`,
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

          // Notify Liveblocks flow sync (Liveblocks Storage controlled state)
          onNodesChange([{ type: "add", item: newNode }]);
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
          onConnect={handleConnect}
          onDelete={onDelete}
          onNodeContextMenu={onNodeContextMenu}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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

          {/* Floating control bar at bottom-left */}
          <CanvasControls />

          {/* Floating shape panel toolbar at bottom center */}
          <ShapePanel />
        </ReactFlow>
      </div>
    );
  }
);
