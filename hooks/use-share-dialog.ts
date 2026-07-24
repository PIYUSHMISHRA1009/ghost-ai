"use client";

import { useState, useCallback } from "react";

export interface CollaboratorUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface OwnerUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface UseShareDialogOptions {
  projectId: string;
}

export function useShareDialog({ projectId }: UseShareDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState<OwnerUser | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchCollaborators = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load collaborators");
      }

      const data = await res.json();
      setIsOwner(data.isOwner);
      setOwner(data.owner);
      setCollaborators(data.collaborators);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading collaborators";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const openShare = useCallback(() => {
    setIsOpen(true);
    setInviteEmail("");
    setError(null);
    setIsCopied(false);
    fetchCollaborators();
  }, [fetchCollaborators]);

  const closeShare = useCallback(() => {
    setIsOpen(false);
    setInviteEmail("");
    setError(null);
    setIsCopied(false);
  }, []);

  const handleInvite = useCallback(async () => {
    const trimmed = inviteEmail.trim();
    if (!trimmed || isInviting) return;

    setIsInviting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to invite collaborator");
      }

      const newCollaborator: CollaboratorUser = await res.json();
      setCollaborators((prev) => [...prev, newCollaborator]);
      setInviteEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inviting collaborator";
      setError(message);
    } finally {
      setIsInviting(false);
    }
  }, [inviteEmail, isInviting, projectId]);

  const handleRemoveCollaborator = useCallback(
    async (collaboratorId: string) => {
      if (deletingId) return;

      setDeletingId(collaboratorId);
      setError(null);

      try {
        const res = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to remove collaborator");
        }

        setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error removing collaborator";
        setError(message);
      } finally {
        setDeletingId(null);
      }
    },
    [deletingId, projectId]
  );

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/editor/${projectId}`
      : `/editor/${projectId}`;

  const handleCopyLink = useCallback(() => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [shareUrl]);

  return {
    isOpen,
    isOwner,
    owner,
    collaborators,
    inviteEmail,
    isLoading,
    isInviting,
    deletingId,
    error,
    isCopied,
    shareUrl,
    setInviteEmail,
    openShare,
    closeShare,
    handleInvite,
    handleRemoveCollaborator,
    handleCopyLink,
  };
}
