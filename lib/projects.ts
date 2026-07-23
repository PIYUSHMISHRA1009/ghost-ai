import { prisma, type Project } from "@/lib/prisma";

export interface UserProjects {
  ownedProjects: Project[];
  sharedProjects: Project[];
}

/**
 * Server-side helper to fetch owned and shared projects for a given authenticated user.
 */
export async function getProjectsForUser(
  userId: string,
  userEmails: string[] = []
): Promise<UserProjects> {
  const ownedProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });

  let sharedProjects: Project[] = [];
  if (userEmails.length > 0) {
    sharedProjects = await prisma.project.findMany({
      where: {
        ownerId: { not: userId },
        collaborators: {
          some: {
            email: { in: userEmails },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return { ownedProjects, sharedProjects };
}
