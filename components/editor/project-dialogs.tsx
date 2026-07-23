"use client";

import { useEffect, useRef, forwardRef } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X, FolderPlus } from "lucide-react";
import type { ProjectActionsHook as ProjectDialogsHook } from "@/hooks/use-project-actions";

interface ProjectDialogsProps {
  hook: ProjectDialogsHook;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
};

const CARD_STYLE: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 51,
  width: "100%",
  maxWidth: 440,
  backgroundColor: "#111114",
  border: "1px solid #2a2a30",
  borderRadius: 20,
  padding: "28px 28px 24px",
  boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
  outline: "none",
};

function Overlay() {
  return <DialogPrimitive.Overlay style={OVERLAY_STYLE} />;
}

interface CloseButtonProps {
  onClose: () => void;
}

function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <button
      aria-label="Close dialog"
      onClick={onClose}
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "none",
        background: "transparent",
        color: "#505060",
        cursor: "pointer",
        transition: "background 0.12s, color 0.12s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#1e1e23";
        (e.currentTarget as HTMLButtonElement).style.color = "#c0c0cc";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = "#505060";
      }}
    >
      <X style={{ width: 14, height: 14 }} />
    </button>
  );
}

// Styled input — fully dark, matches design system
const StyledInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function StyledInput(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        style={{
          width: "100%",
          height: 42,
          padding: "0 14px",
          borderRadius: 10,
          border: "1px solid #2a2a30",
          backgroundColor: "#0c0c0f",
          color: "#f0f0f4",
          fontSize: 14,
          fontFamily: "var(--font-geist-sans)",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
          ...props.style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#00c8d4";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,200,212,0.12)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#2a2a30";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
    );
  }
);

// Primary cyan button
function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        padding: "0 18px",
        borderRadius: 9,
        border: "none",
        backgroundColor: disabled ? "#1e1e23" : "#00c8d4",
        color: disabled ? "#505060" : "#000",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "var(--font-geist-sans)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#00b5c0";
      }}
      onMouseLeave={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#00c8d4";
      }}
    >
      {children}
    </button>
  );
}

// Destructive red button
function DestructiveButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        padding: "0 18px",
        borderRadius: 9,
        border: "none",
        backgroundColor: "#ff4d4f",
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "var(--font-geist-sans)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#e53e3f";
      }}
      onMouseLeave={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#ff4d4f";
      }}
    >
      {children}
    </button>
  );
}

// Ghost cancel button
function CancelButton({ onClose, disabled }: { onClose: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClose}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        padding: "0 16px",
        borderRadius: 9,
        border: "1px solid #2a2a30",
        backgroundColor: "transparent",
        color: "#808090",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-geist-sans)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.12s, color 0.12s, border-color 0.12s",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#1e1e23";
          (e.currentTarget as HTMLButtonElement).style.color = "#c0c0cc";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a42";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#808090";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a30";
        }
      }}
    >
      Cancel
    </button>
  );
}

// Error Banner component
function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        marginBottom: 12,
        padding: "8px 12px",
        borderRadius: 8,
        backgroundColor: "rgba(255,77,79,0.1)",
        border: "1px solid rgba(255,77,79,0.2)",
        color: "#ff4d4f",
        fontSize: 12,
      }}
    >
      {message}
    </div>
  );
}

// ─── Create Project ──────────────────────────────────────────────────────────

function CreateProjectDialog({ hook }: { hook: ProjectDialogsHook }) {
  const isOpen = hook.dialogState.kind === "create";

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && !hook.isLoading && hook.close()}>
      <DialogPrimitive.Portal>
        <Overlay />
        <DialogPrimitive.Content style={CARD_STYLE} aria-describedby="create-desc">
          <CloseButton onClose={hook.close} />

          {/* Icon + Title */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(0,200,212,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <FolderPlus style={{ width: 18, height: 18, color: "#00c8d4" }} />
            </div>

            <DialogPrimitive.Title
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#f0f0f4",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              New project
            </DialogPrimitive.Title>

            <DialogPrimitive.Description
              id="create-desc"
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "#808090",
                lineHeight: 1.5,
              }}
            >
              Give your architecture workspace a name to get started.
            </DialogPrimitive.Description>
          </div>

          {hook.error && <ErrorBanner message={hook.error} />}

          {/* Input section */}
          <div style={{ marginBottom: 6 }}>
            <label
              htmlFor="create-project-name"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#c0c0cc",
                marginBottom: 8,
                letterSpacing: "0.01em",
              }}
            >
              Project name
            </label>
            <StyledInput
              id="create-project-name"
              placeholder="e.g. E-commerce Platform"
              value={hook.name}
              disabled={hook.isLoading}
              autoFocus
              onChange={(e) => hook.setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && hook.name.trim() && !hook.isLoading) {
                  hook.handleCreate();
                }
              }}
            />

            {/* Room ID preview */}
            <div
              style={{
                marginTop: 10,
                minHeight: 20,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11, color: "#505060" }}>Room ID</span>
              <span style={{ fontSize: 11, color: "#505060" }}>/</span>
              <span
                style={{
                  fontSize: 11,
                  color: "#00c8d4",
                  fontFamily: "var(--font-geist-mono)",
                  backgroundColor: "rgba(0,200,212,0.08)",
                  padding: "2px 8px",
                  borderRadius: 5,
                }}
              >
                {hook.roomId || hook.suffix}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #1e1e23",
            }}
          >
            <CancelButton onClose={hook.close} disabled={hook.isLoading} />
            <PrimaryButton
              disabled={!hook.name.trim() || hook.isLoading}
              onClick={hook.handleCreate}
            >
              {hook.isLoading ? "Creating..." : "Create project"}
            </PrimaryButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ─── Rename Project ──────────────────────────────────────────────────────────

function RenameProjectDialog({ hook }: { hook: ProjectDialogsHook }) {
  const isOpen = hook.dialogState.kind === "rename";
  const inputRef = useRef<HTMLInputElement>(null);
  const currentName = hook.dialogState.target?.name ?? "";

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  const isUnchanged = hook.name.trim() === currentName;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && !hook.isLoading && hook.close()}>
      <DialogPrimitive.Portal>
        <Overlay />
        <DialogPrimitive.Content style={CARD_STYLE} aria-describedby="rename-desc">
          <CloseButton onClose={hook.close} />

          <div style={{ marginBottom: 20 }}>
            <DialogPrimitive.Title
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#f0f0f4",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              Rename project
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              id="rename-desc"
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "#808090",
                lineHeight: 1.5,
              }}
            >
              Renaming{" "}
              <span style={{ color: "#c0c0cc", fontWeight: 500 }}>
                &ldquo;{currentName}&rdquo;
              </span>
            </DialogPrimitive.Description>
          </div>

          {hook.error && <ErrorBanner message={hook.error} />}

          <div style={{ marginBottom: 4 }}>
            <label
              htmlFor="rename-project-name"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#c0c0cc",
                marginBottom: 8,
              }}
            >
              New name
            </label>
            <StyledInput
              id="rename-project-name"
              ref={inputRef}
              value={hook.name}
              disabled={hook.isLoading}
              onChange={(e) => hook.setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && hook.name.trim() && !isUnchanged && !hook.isLoading) {
                  hook.handleRename();
                }
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #1e1e23",
            }}
          >
            <CancelButton onClose={hook.close} disabled={hook.isLoading} />
            <PrimaryButton
              disabled={!hook.name.trim() || isUnchanged || hook.isLoading}
              onClick={hook.handleRename}
            >
              {hook.isLoading ? "Saving..." : "Save"}
            </PrimaryButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ─── Delete Project ──────────────────────────────────────────────────────────

function DeleteProjectDialog({ hook }: { hook: ProjectDialogsHook }) {
  const isOpen = hook.dialogState.kind === "delete";
  const targetName = hook.dialogState.target?.name ?? "this project";

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && !hook.isLoading && hook.close()}>
      <DialogPrimitive.Portal>
        <Overlay />
        <DialogPrimitive.Content style={CARD_STYLE} aria-describedby="delete-desc">
          <CloseButton onClose={hook.close} />

          <div style={{ marginBottom: 20 }}>
            {/* Red warning icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255,77,79,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff4d4f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>

            <DialogPrimitive.Title
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#f0f0f4",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              Delete project
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              id="delete-desc"
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "#808090",
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete{" "}
              <span style={{ color: "#f0f0f4", fontWeight: 500 }}>
                &ldquo;{targetName}&rdquo;
              </span>
              ? This action cannot be undone.
            </DialogPrimitive.Description>
          </div>

          {hook.error && <ErrorBanner message={hook.error} />}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #1e1e23",
            }}
          >
            <CancelButton onClose={hook.close} disabled={hook.isLoading} />
            <DestructiveButton disabled={hook.isLoading} onClick={hook.handleDelete}>
              {hook.isLoading ? "Deleting..." : "Delete project"}
            </DestructiveButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ─── Composed export ──────────────────────────────────────────────────────────

export function ProjectDialogs({ hook }: ProjectDialogsProps) {
  return (
    <>
      <CreateProjectDialog hook={hook} />
      <RenameProjectDialog hook={hook} />
      <DeleteProjectDialog hook={hook} />
    </>
  );
}
