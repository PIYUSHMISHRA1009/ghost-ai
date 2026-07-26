"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles, FolderOpen, Loader2, Check, AlertCircle, Cloud } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { NAVBAR_HEIGHT } from "@/lib/layout-constants";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/hooks/use-canvas-autosave";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  onShare?: () => void;
  isAiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
  onOpenTemplates?: () => void;
  hideUserButton?: boolean;
  saveStatus?: SaveStatus;
  onSave?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  onShare,
  isAiSidebarOpen,
  onAiSidebarToggle,
  onOpenTemplates,
  hideUserButton = false,
  saveStatus,
  onSave,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: NAVBAR_HEIGHT,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#111114",
        borderBottom: "1px solid #1e1e23",
      }}
    >
      {/* ── LEFT: sidebar toggle & project title ────────────────────────── */}
      <div style={{ paddingLeft: 12, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
          onClick={onSidebarToggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#808090] hover:text-[#c0c0cc] hover:bg-[#1e1e23] active:bg-[#18181c] focus-visible:ring-2 focus-visible:ring-[#00c8d4] outline-none transition-colors cursor-pointer bg-transparent border-0"
        >
          <SidebarIcon style={{ width: 18, height: 18 }} />
        </button>

        {projectName && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ height: 20, width: 1, backgroundColor: "#2a2a30" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <h1
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#f0f0f4",
                  margin: 0,
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: 220,
                  lineHeight: 1.2,
                }}
              >
                {projectName}
              </h1>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 400,
                  color: "#505060",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Workspace
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: actions & user avatar ───────────────────────────────── */}
      <div
        style={{
          marginLeft: "auto",
          paddingRight: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Save Status & Manual Save Button */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={saveStatus === "saving"}
            title={
              saveStatus === "saving"
                ? "Saving canvas changes..."
                : saveStatus === "saved"
                ? "Canvas changes saved to cloud"
                : saveStatus === "error"
                ? "Error saving canvas"
                : "Save canvas changes"
            }
            className={cn(
              "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#00c8d4]",
              saveStatus === "error"
                ? "border-[#ff4d4f]/40 bg-[#ff4d4f]/10 text-[#ff4d4f]"
                : saveStatus === "saved"
                ? "border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]"
                : saveStatus === "saving"
                ? "border-[#2a2a30] bg-[#18181c] text-[#00c8d4]"
                : "border-[#2a2a30] hover:border-[#3a3a42] bg-[#18181c] hover:bg-[#1e1e23] text-[#c0c0cc]"
            )}
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00c8d4]" />
                <span>Saving...</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34d399]" />
                <span>Saved</span>
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-[#ff4d4f]" />
                <span>Save Error</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-[#00c8d4]" />
                <span>Save</span>
              </>
            )}
          </button>
        )}
        {/* Share Button */}
        {onShare && (
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[#2a2a30] hover:border-[#3a3a42] bg-[#18181c] hover:bg-[#1e1e23] text-[#c0c0cc] text-[12px] font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#00c8d4]"
          >
            <Share2 style={{ width: 13, height: 13, color: "#00c8d4" }} />
            Share
          </button>
        )}

        {/* Starter Templates Button */}
        {onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[#2a2a30] hover:border-[#3a3a42] bg-[#18181c] hover:bg-[#1e1e23] text-[#c0c0cc] text-[12px] font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#00c8d4]"
          >
            <FolderOpen style={{ width: 13, height: 13, color: "#00c8d4" }} />
            Templates
          </button>
        )}

        {/* AI Sidebar Toggle */}
        {onAiSidebarToggle && (
          <button
            aria-label={isAiSidebarOpen ? "Close AI Assistant" : "Open AI Assistant"}
            onClick={onAiSidebarToggle}
            className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8b82ff] ${
              isAiSidebarOpen
                ? "border border-[rgba(100,87,249,0.4)] bg-[rgba(100,87,249,0.12)] text-[#8b82ff]"
                : "border border-[#2a2a30] hover:border-[rgba(100,87,249,0.3)] bg-[#18181c] hover:bg-[rgba(100,87,249,0.08)] text-[#808090] hover:text-[#8b82ff]"
            }`}
          >
            <Sparkles style={{ width: 13, height: 13 }} />
            AI Copilot
          </button>
        )}

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" style={{ color: "#c0c0cc", borderRadius: 8 }}>
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              size="sm"
              style={{
                backgroundColor: "#00c8d4",
                color: "#000",
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Sign up
            </Button>
          </SignUpButton>
        </Show>

        {!hideUserButton && (
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  rootBox:
                    "flex items-center",
                  userButtonTrigger:
                    "focus:shadow-none focus-visible:ring-2 focus-visible:ring-[#00c8d4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111114] outline-none rounded-lg",
                  avatarBox:
                    "h-[30px] w-[30px] rounded-lg ring-1 ring-white/10 hover:ring-white/25 transition-all",
                  userButtonPopoverCard:
                    "bg-[#111114] border border-[#2a2a30] shadow-2xl rounded-xl",
                  userButtonPopoverActionButton:
                    "hover:bg-[#1e1e23] rounded-lg",
                  userButtonPopoverActionButtonText:
                    "text-[13px] text-[#c0c0cc]",
                  userButtonPopoverActionButtonIcon:
                    "text-[#808090]",
                  userPreviewMainIdentifier:
                    "text-[14px] font-medium text-[#f0f0f4]",
                  userPreviewSecondaryIdentifier:
                    "text-[12px] text-[#808090]",
                  userButtonPopoverFooter:
                    "hidden",
                },
              }}
            />
          </Show>
        )}
      </div>
    </header>
  );
}
