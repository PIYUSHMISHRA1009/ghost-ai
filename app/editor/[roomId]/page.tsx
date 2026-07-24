import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectAccess } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/projects";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShellClient } from "@/components/editor/workspace-shell-client";

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { roomId } = await params;

  if (!roomId || typeof roomId !== "string") {
    return <AccessDenied />;
  }

  const { hasAccess, project } = await getProjectAccess(roomId);

  if (!hasAccess || !project) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getProjectsForUser(userId);

  return (
    <WorkspaceShellClient
      project={project}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
