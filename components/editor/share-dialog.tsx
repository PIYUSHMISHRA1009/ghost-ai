"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Trash2, Loader2, UserPlus, Link2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CollaboratorUser, OwnerUser } from "@/hooks/use-share-dialog";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  isOwner: boolean;
  owner: OwnerUser | null;
  collaborators: CollaboratorUser[];
  inviteEmail: string;
  isLoading: boolean;
  isInviting: boolean;
  deletingId: string | null;
  error: string | null;
  isCopied: boolean;
  onInviteEmailChange: (value: string) => void;
  onInvite: () => void;
  onRemoveCollaborator: (id: string) => void;
  onCopyLink: () => void;
}

function UserAvatar({
  name,
  email,
  avatarUrl,
}: {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
}) {
  const [hasError, setHasError] = useState(false);
  const initial = (name?.trim() || email.trim())[0]?.toUpperCase() || "?";

  if (avatarUrl && !hasError) {
    return (
      <Image
        src={avatarUrl}
        alt={name || email}
        width={34}
        height={34}
        onError={() => setHasError(true)}
        className="w-[34px] h-[34px] rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
      />
    );
  }

  return (
    <div
      className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
      style={{
        background: "rgba(0,200,212,0.10)",
        border: "1px solid rgba(0,200,212,0.18)",
        color: "var(--accent-primary)",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      {initial}
    </div>
  );
}

export function ShareDialog({
  isOpen,
  onClose,
  projectName,
  isOwner,
  owner,
  collaborators,
  inviteEmail,
  isLoading,
  isInviting,
  deletingId,
  error,
  isCopied,
  onInviteEmailChange,
  onInvite,
  onRemoveCollaborator,
  onCopyLink,
}: ShareDialogProps) {
  const handleSubmitInvite = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[460px] p-0 border-0 shadow-none bg-transparent overflow-visible"
      >
        {/* Outer card */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
            fontFamily: "var(--font-geist-sans)",
            overflow: "hidden",
          }}
        >
          {/* Header strip */}
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid var(--border-default)",
              background: "linear-gradient(180deg, rgba(0,200,212,0.04) 0%, transparent 100%)",
            }}
          >
            <DialogHeader className="space-y-0.5 text-left p-0">
              <DialogTitle
                className="flex items-center gap-2 text-base font-semibold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist-sans)" }}
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-xl"
                  style={{ background: "rgba(0,200,212,0.12)", border: "1px solid rgba(0,200,212,0.2)" }}
                >
                  <Users className="w-[15px] h-[15px]" style={{ color: "var(--accent-primary)" }} />
                </span>
                Share &quot;{projectName}&quot;
              </DialogTitle>
              <DialogDescription
                className="text-[12px] leading-5 pl-9"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-sans)" }}
              >
                {isOwner
                  ? "Invite collaborators by email or copy the project link."
                  : "View project members and copy the project link."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-5 p-6">
            {/* Invite Form — Owner Only */}
            {isOwner && (
              <form onSubmit={handleSubmitInvite} className="flex flex-col gap-2">
                <label
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Invite collaborator
                </label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => onInviteEmailChange(e.target.value)}
                    className="text-xs h-9 flex-1"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-primary)",
                      borderRadius: "12px",
                      fontFamily: "var(--font-geist-sans)",
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isInviting || !inviteEmail.trim()}
                    className="h-9 px-4 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                    style={{
                      background: "var(--accent-primary)",
                      color: "#000",
                      borderRadius: "12px",
                      fontFamily: "var(--font-geist-sans)",
                    }}
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Inviting…
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Invite
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Error Alert */}
            {error && (
              <div
                className="px-3 py-2.5 text-xs rounded-xl"
                style={{
                  background: "rgba(255,77,79,0.08)",
                  border: "1px solid rgba(255,77,79,0.2)",
                  color: "var(--state-error)",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                {error}
              </div>
            )}

            {/* Copy Link */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Project Link
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center flex-1 h-9 px-3 gap-2 min-w-0"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <Link2 className="w-3 h-3 flex-shrink-0" style={{ color: "var(--text-faint)" }} />
                  <span
                    className="text-xs truncate select-all"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                  >
                    {typeof window !== "undefined" ? window.location.href : ""}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={onCopyLink}
                  variant="outline"
                  className="h-9 px-3 text-xs flex items-center gap-1.5 flex-shrink-0"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-secondary)",
                    borderRadius: "12px",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" style={{ color: "var(--state-success)" }} />
                      <span style={{ color: "var(--state-success)", fontWeight: 600 }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--border-default)", margin: "0 -2px" }} />

            {/* Members List */}
            <div className="flex flex-col gap-2.5">
              <h4
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                People with access
              </h4>

              {isLoading ? (
                <div
                  className="py-6 flex items-center justify-center gap-2 text-xs"
                  style={{ color: "var(--text-faint)" }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--accent-primary)" }} />
                  Loading members…
                </div>
              ) : (
                <div className="max-h-[180px] overflow-y-auto flex flex-col gap-1.5 pr-0.5">
                  {/* Owner Row */}
                  {owner && (
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-2xl"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          name={owner.name}
                          email={owner.email}
                          avatarUrl={owner.avatarUrl}
                        />
                        <div className="min-w-0 flex flex-col">
                          <span
                            className="text-xs font-medium truncate"
                            style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist-sans)" }}
                          >
                            {owner.name}
                          </span>
                          <span
                            className="text-[11px] truncate"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-sans)" }}
                          >
                            {owner.email}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "rgba(0,200,212,0.10)",
                          border: "1px solid rgba(0,200,212,0.2)",
                          color: "var(--accent-primary)",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        Owner
                      </span>
                    </div>
                  )}

                  {/* Collaborators Rows */}
                  {collaborators.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between px-3 py-2 rounded-2xl transition-colors"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          name={c.name}
                          email={c.email}
                          avatarUrl={c.avatarUrl}
                        />
                        <div className="min-w-0 flex flex-col">
                          <span
                            className="text-xs font-medium truncate"
                            style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist-sans)" }}
                          >
                            {c.name || c.email}
                          </span>
                          {c.name && (
                            <span
                              className="text-[11px] truncate"
                              style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-sans)" }}
                            >
                              {c.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {isOwner ? (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          disabled={deletingId === c.id}
                          onClick={() => onRemoveCollaborator(c.id)}
                          className="w-7 h-7 rounded-lg flex-shrink-0 transition-colors"
                          style={{ color: "var(--text-muted)" }}
                          title="Remove collaborator"
                        >
                          {deletingId === c.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      ) : (
                        <span
                          className="text-[11px] px-2 py-0.5 flex-shrink-0"
                          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-sans)" }}
                        >
                          Collaborator
                        </span>
                      )}
                    </div>
                  ))}

                  {!owner && collaborators.length === 0 && (
                    <p
                      className="text-xs text-center py-5"
                      style={{ color: "var(--text-faint)", fontFamily: "var(--font-geist-sans)" }}
                    >
                      No collaborators added yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
