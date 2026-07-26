import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getProjectAccess } from "@/lib/project-access";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

/**
 * GET /api/projects/[projectId]/canvas
 *
 * Fetches the saved canvas JSON state from Vercel Blob using the URL recorded on
 * the Prisma project model.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const { hasAccess } = await getProjectAccess(projectId);
  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { canvasJsonPath: true },
  });

  if (!project || !project.canvasJsonPath) {
    return NextResponse.json({ nodes: [], edges: [], isSaved: false });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(project.canvasJsonPath, {
      cache: "no-store",
      headers,
    });
    if (!res.ok) {
      return NextResponse.json({ nodes: [], edges: [], isSaved: false });
    }
    const data = (await res.json()) as { nodes?: unknown[]; edges?: unknown[] };
    return NextResponse.json({
      nodes: Array.isArray(data.nodes) ? data.nodes : [],
      edges: Array.isArray(data.edges) ? data.edges : [],
      isSaved: true,
    });
  } catch (error) {
    console.error("Error fetching saved canvas blob:", error);
    return NextResponse.json({ nodes: [], edges: [], isSaved: false });
  }
}

/**
 * PUT /api/projects/[projectId]/canvas
 *
 * Saves the latest canvas JSON state (nodes and edges) to Vercel Blob and records
 * the resulting blob URL in the Prisma project record.
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const { hasAccess } = await getProjectAccess(projectId);
  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error("BLOB_READ_WRITE_TOKEN is missing in environment variables.");
      return NextResponse.json(
        { error: "Blob storage configuration error: BLOB_READ_WRITE_TOKEN is missing" },
        { status: 500 }
      );
    }

    const jsonString = JSON.stringify(body);
    const blob = await put(`canvas/${projectId}.json`, jsonString, {
      access: "private",
      addRandomSuffix: true,
      contentType: "application/json",
      token,
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { canvasJsonPath: blob.url },
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error("Error saving canvas to Vercel Blob:", errorDetails, error);
    return NextResponse.json(
      { error: "Failed to save canvas state", details: errorDetails },
      { status: 500 }
    );
  }
}
