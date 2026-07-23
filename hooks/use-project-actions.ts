"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export type DialogKind = "create" | "rename" | "delete" | null;

export interface ProjectDialogTarget {
  id: string;
  name: string;
}

export interface ProjectDialogState {
  kind: DialogKind;
  target: ProjectDialogTarget | null;
}

export interface ProjectActionsHook {
  dialogState: ProjectDialogState;
  name: string;
  slug: string;
  suffix: string;
  roomId: string;
  isLoading: boolean;
  error: string | null;
  openCreate: () => void;
  openRename: (project: ProjectDialogTarget) => void;
  openDelete: (project: ProjectDialogTarget) => void;
  close: () => void;
  setName: (value: string) => void;
  handleCreate: () => Promise<void>;
  handleRename: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateShortSuffix(): string {
  return Math.random().toString(36).substring(2, 6);
}

interface UseProjectActionsOptions {
  activeProjectId?: string;
}

export function useProjectActions(
  options: UseProjectActionsOptions = {}
): ProjectActionsHook {
  const router = useRouter();
  const pathname = usePathname();

  const [dialogState, setDialogState] = useState<ProjectDialogState>({
    kind: null,
    target: null,
  });
  const [name, setNameState] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = toSlug(name);
  const roomId = suffix
    ? slug
      ? `${slug}-${suffix}`
      : `untitled-project-${suffix}`
    : "";

  const openCreate = useCallback(() => {
    setNameState("");
    setSuffix(generateShortSuffix());
    setError(null);
    setDialogState({ kind: "create", target: null });
  }, []);

  const openRename = useCallback((project: ProjectDialogTarget) => {
    setNameState(project.name);
    setError(null);
    setDialogState({ kind: "rename", target: project });
  }, []);

  const openDelete = useCallback((project: ProjectDialogTarget) => {
    setNameState("");
    setError(null);
    setDialogState({ kind: "delete", target: project });
  }, []);

  const close = useCallback(() => {
    setDialogState({ kind: null, target: null });
    setNameState("");
    setSuffix("");
    setError(null);
    setIsLoading(false);
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
  }, []);

  const handleCreate = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const finalName = name.trim() || "Untitled Project";
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: roomId,
          name: finalName,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create project");
      }

      const project = await res.json();
      close();
      router.push(`/editor/${project.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setIsLoading(false);
    }
  }, [isLoading, name, roomId, close, router]);

  const handleRename = useCallback(async () => {
    if (isLoading || !dialogState.target || !name.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${dialogState.target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to rename project");
      }

      close();
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setIsLoading(false);
    }
  }, [isLoading, dialogState.target, name, close, router]);

  const handleDelete = useCallback(async () => {
    if (isLoading || !dialogState.target) return;
    const targetId = dialogState.target.id;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete project");
      }

      close();

      const isActiveWorkspace =
        options.activeProjectId === targetId ||
        pathname === `/editor/${targetId}`;

      if (isActiveWorkspace) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setIsLoading(false);
    }
  }, [isLoading, dialogState.target, options.activeProjectId, pathname, close, router]);

  return {
    dialogState,
    name,
    slug,
    suffix,
    roomId,
    isLoading,
    error,
    openCreate,
    openRename,
    openDelete,
    close,
    setName,
    handleCreate,
    handleRename,
    handleDelete,
  };
}
