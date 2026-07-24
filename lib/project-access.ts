import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma, type Project } from "@/lib/prisma";

export interface UserIdentity {
  userId: string | null;
  email: string | null;
}

export interface ProjectAccessResult {
  hasAccess: boolean;
  project: Project | null;
}

export async function getClerkUserIdentity(): Promise<UserIdentity> {
  const { userId } = await auth();
  if (!userId) {
    return { userId: null, email: null };
  }

  const user = await currentUser();
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  return { userId, email: primaryEmail };
}

export async function getProjectAccess(
  roomId: string
): Promise<ProjectAccessResult> {
  const { userId, email } = await getClerkUserIdentity();

  if (!userId) {
    return { hasAccess: false, project: null };
  }

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: {
      collaborators: true,
    },
  });

  if (!project) {
    return { hasAccess: false, project: null };
  }

  const isOwner = project.ownerId === userId;
  const isCollaborator =
    Boolean(email) &&
    project.collaborators.some(
      (c) => c.email.toLowerCase() === email?.toLowerCase()
    );

  const hasAccess = isOwner || isCollaborator;

  return {
    hasAccess,
    project: hasAccess ? project : null,
  };
}
