"use client";

export type {
  DialogKind,
  ProjectDialogTarget,
  ProjectDialogState,
  ProjectActionsHook as ProjectDialogsHook,
} from "./use-project-actions";

export { useProjectActions as useProjectDialogs, useProjectActions } from "./use-project-actions";
