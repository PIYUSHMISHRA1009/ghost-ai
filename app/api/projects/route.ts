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

  const validId = rawId && /^c[a-z0-9]{24,31}$/i.test(rawId) ? rawId : undefined;

  try {
    const project = await prisma.project.create({
      data: {
        ...(validId ? { id: validId } : {}),
        ownerId: userId,
        name,
        description,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Project already exists" }, { status: 409 });
    }
    throw error;
  }
}
