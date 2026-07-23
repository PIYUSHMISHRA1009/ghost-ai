import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma, type Project } from "@/lib/prisma";

interface CreateProjectBody {
  id?: string;
  name?: string;
  description?: string;
}

export async function GET(): Promise<NextResponse<Project[] | { error: string }>> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<Project | { error: string }>> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CreateProjectBody | null;
  const rawId = typeof body?.id === "string" ? body.id.trim() : undefined;
  const rawName = typeof body?.name === "string" ? body.name.trim() : "";
  const name = rawName || "Untitled Project";
  const description = typeof body?.description === "string" ? body.description.trim() || undefined : undefined;

  const project = await prisma.project.create({
    data: {
      ...(rawId ? { id: rawId } : {}),
      ownerId: userId,
      name,
      description,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
