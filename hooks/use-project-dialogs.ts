"use client";

import { useState, useCallback } from "react";

export type DialogKind = "create" | "rename" | "delete" | null;

export interface ProjectDialogTarget {
  id: string;
  name: string;
}

export interface ProjectDialogState {
  kind: DialogKind;
  target: ProjectDialogTarget | null;
}

export interface ProjectDialogsHook {
  dialogState: ProjectDialogState;
  name: string;
  slug: string;
  isLoading: boolean;
  openCreate: () => void;
  openRename: (project: ProjectDialogTarget) => void;
  openDelete: (project: ProjectDialogTarget) => void;
  close: () => void;
  setName: (value: string) => void;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useProjectDialogs(): ProjectDialogsHook {
  const [dialogState, setDialogState] = useState<ProjectDialogState>({
    kind: null,
    target: null,
  });
  const [name, setNameState] = useState("");
  const [isLoading] = useState(false);

  const slug = toSlug(name);

  const openCreate = useCallback(() => {
    setNameState("");
    setDialogState({ kind: "create", target: null });
  }, []);

  const openRename = useCallback((project: ProjectDialogTarget) => {
    setNameState(project.name);
    setDialogState({ kind: "rename", target: project });
  }, []);

  const openDelete = useCallback((project: ProjectDialogTarget) => {
    setNameState("");
    setDialogState({ kind: "delete", target: project });
  }, []);

  const close = useCallback(() => {
    setDialogState({ kind: null, target: null });
    setNameState("");
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
  }, []);

  return {
    dialogState,
    name,
    slug,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName,
  };
}
