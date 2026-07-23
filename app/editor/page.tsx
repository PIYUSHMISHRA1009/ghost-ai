import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProjectsForUser } from "@/lib/projects";
import { EditorHomeClient } from "@/components/editor/editor-home-client";

export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const userEmails =
    user?.emailAddresses
      .map((e) => e.emailAddress)
      .filter((email): email is string => Boolean(email)) ?? [];

  const { ownedProjects, sharedProjects } = await getProjectsForUser(
    userId,
    userEmails
  );

  return (
    <EditorHomeClient
      initialOwnedProjects={ownedProjects}
      initialSharedProjects={sharedProjects}
    />
  );
}
