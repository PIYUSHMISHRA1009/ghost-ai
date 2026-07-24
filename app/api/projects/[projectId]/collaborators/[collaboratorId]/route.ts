import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ projectId: string; collaboratorId: string }>;
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, collaboratorId } = await params;

  if (!projectId || !collaboratorId) {
    return NextResponse.json(
      { error: "Invalid project or collaborator ID" },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      { error: "Forbidden: Only the project owner can remove collaborators" },
      { status: 403 }
    );
  }

  try {
    await prisma.projectCollaborator.delete({
      where: {
        id: collaboratorId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }
    throw error;
  }
}
