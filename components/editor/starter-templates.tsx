import type { CanvasNode, CanvasEdge, CanvasNodeData, CanvasEdgeData, NodeShape } from "@/types/canvas";
import { DEFAULT_NODE_COLOR } from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const NODE_TYPE = "canvasNode";
const EDGE_TYPE = "canvasEdge";

function createNode(
  id: string,
  label: string,
  color: string = DEFAULT_NODE_COLOR,
  shape: NodeShape = "rectangle",
  position: { x: number; y: number },
  width: number = 160,
  height: number = 80
): CanvasNode {
  return {
    id,
    type: NODE_TYPE,
    position,
    data: { label, color, shape } as CanvasNodeData,
    width,
    height,
    style: { width, height },
  };
}

function createEdge(id: string, source: string, target: string): CanvasEdge {
  return {
    id,
    source,
    target,
    type: EDGE_TYPE,
    data: {} as CanvasEdgeData,
  };
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description:
      "API Gateway routes traffic to isolated services, each backed by a dedicated database and connected via a shared message bus.",
    nodes: [
      createNode("microservices-api-gateway", "API Gateway", "#10233D", "rectangle", { x: 0, y: 100 }, 160, 80),
      createNode("microservices-user-service", "User Service", "#2E1938", "pill", { x: -220, y: 0 }, 140, 60),
      createNode("microservices-order-service", "Order Service", "#331B00", "pill", { x: 0, y: 0 }, 140, 60),
      createNode("microservices-payment-service", "Payment Service", "#3C1618", "pill", { x: 220, y: 0 }, 140, 60),
      createNode("microservices-message-queue", "Message Queue", "#3A1726", "cylinder", { x: 0, y: -160 }, 110, 110),
      createNode("microservices-database", "Database", "#062822", "diamond", { x: 0, y: -280 }, 120, 120),
    ],
    edges: [
      createEdge("microservices-e1", "microservices-api-gateway", "microservices-user-service"),
      createEdge("microservices-e2", "microservices-api-gateway", "microservices-order-service"),
      createEdge("microservices-e3", "microservices-api-gateway", "microservices-payment-service"),
      createEdge("microservices-e4", "microservices-order-service", "microservices-message-queue"),
      createEdge("microservices-e5", "microservices-message-queue", "microservices-database"),
    ],
  },
  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description:
      "End-to-end delivery from source commit through build, test, containerisation, and staged deployment to production.",
    nodes: [
      createNode("cicd-git", "Git Repo", "#10233D", "rectangle", { x: 0, y: 240 }, 160, 80),
      createNode("cicd-build", "Build", "#2E1938", "rectangle", { x: 0, y: 120 }, 160, 80),
      createNode("cicd-test", "Test", "#331B00", "rectangle", { x: 0, y: 0 }, 160, 80),
      createNode("cicd-deploy", "Deploy", "#3C1618", "rectangle", { x: -180, y: -120 }, 160, 80),
      createNode("cicd-monitor", "Monitor", "#3A1726", "rectangle", { x: 180, y: -120 }, 160, 80),
      createNode("cicd-alert", "Alert", "#0F2E18", "circle", { x: 0, y: -240 }, 100, 100),
    ],
    edges: [
      createEdge("cicd-e1", "cicd-git", "cicd-build"),
      createEdge("cicd-e2", "cicd-build", "cicd-test"),
      createEdge("cicd-e3", "cicd-test", "cicd-deploy"),
      createEdge("cicd-e4", "cicd-test", "cicd-monitor"),
      createEdge("cicd-e5", "cicd-monitor", "cicd-alert"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description:
      "Producers publish events to a central bus. Independent consumers handle emails, push notifications, analytics, and error queues.",
    nodes: [
      createNode("events-source", "Event Source", "#10233D", "rectangle", { x: -240, y: 80 }, 160, 80),
      createNode("events-bus", "Event Bus", "#2E1938", "cylinder", { x: 0, y: 80 }, 110, 110),
      createNode("events-processor-a", "Processor A", "#331B00", "pill", { x: 240, y: -60 }, 140, 60),
      createNode("events-processor-b", "Processor B", "#3C1618", "pill", { x: 240, y: 120 }, 140, 60),
      createNode("events-sink", "Data Sink", "#3A1726", "diamond", { x: 0, y: -160 }, 120, 120),
      createNode("events-cache", "Cache", "#0F2E18", "hexagon", { x: -240, y: -160 }, 120, 100),
    ],
    edges: [
      createEdge("events-e1", "events-source", "events-bus"),
      createEdge("events-e2", "events-bus", "events-processor-a"),
      createEdge("events-e3", "events-bus", "events-processor-b"),
      createEdge("events-e4", "events-processor-a", "events-sink"),
      createEdge("events-e5", "events-processor-b", "events-sink"),
      createEdge("events-e6", "events-sink", "events-cache"),
    ],
  },
];
