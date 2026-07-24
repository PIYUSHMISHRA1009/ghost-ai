"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  onShare?: () => void;
  isAiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  onShare,
  isAiSidebarOpen,
  onAiSidebarToggle,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "#808090",
            cursor: "pointer",
            transition: "background 0.12s, color 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1e1e23";
            (e.currentTarget as HTMLButtonElement).style.color = "#c0c0cc";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#808090";
          }}
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
        {/* Share Button */}
        {onShare && (
          <button
            onClick={onShare}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #2a2a30",
              backgroundColor: "#18181c",
              color: "#c0c0cc",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.12s, border-color 0.12s",
              fontFamily: "var(--font-geist-sans)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1e1e23";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a42";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#18181c";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a30";
            }}
          >
            <Share2 style={{ width: 13, height: 13, color: "#00c8d4" }} />
            Share
          </button>
        )}

        {/* AI Sidebar Toggle */}
        {onAiSidebarToggle && (
          <button
            aria-label={isAiSidebarOpen ? "Close AI Assistant" : "Open AI Assistant"}
            onClick={onAiSidebarToggle}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 14px",
              borderRadius: 8,
              border: isAiSidebarOpen ? "1px solid rgba(100, 87, 249, 0.4)" : "1px solid #2a2a30",
              backgroundColor: isAiSidebarOpen ? "rgba(100, 87, 249, 0.12)" : "#18181c",
              color: isAiSidebarOpen ? "#8b82ff" : "#808090",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.12s, border-color 0.12s, color 0.12s",
              fontFamily: "var(--font-geist-sans)",
            }}
            onMouseEnter={(e) => {
              if (!isAiSidebarOpen) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(100, 87, 249, 0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100, 87, 249, 0.3)";
                (e.currentTarget as HTMLButtonElement).style.color = "#8b82ff";
              }
            }}
            onMouseLeave={(e) => {
              if (!isAiSidebarOpen) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#18181c";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a30";
                (e.currentTarget as HTMLButtonElement).style.color = "#808090";
              }
            }}
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
      </div>
    </header>
  );
}
