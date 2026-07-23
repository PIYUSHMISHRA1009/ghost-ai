"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
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
      {/* ── LEFT: sidebar toggle ─────────────────────────────── */}
      <div style={{ paddingLeft: 12, flexShrink: 0 }}>
        <Button
          aria-label={
            isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"
          }
          onClick={onSidebarToggle}
          size="icon"
          variant="ghost"
          style={{ color: "#808090" }}
        >
          <SidebarIcon style={{ width: 20, height: 20 }} />
        </Button>
      </div>

      {/* ── RIGHT: user avatar — pushed all the way right with marginLeft auto ── */}
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
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" style={{ color: "#c0c0cc" }}>
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
                  "focus:shadow-none focus-visible:ring-0 outline-none rounded-full",
                avatarBox:
                  "h-[34px] w-[34px] rounded-full ring-2 ring-white/10 hover:ring-white/25 transition-all",
                userButtonPopoverCard:
                  "bg-[#111114] border border-[#2a2a30] shadow-2xl rounded-2xl",
                userButtonPopoverActionButton:
                  "hover:bg-[#1e1e23] rounded-xl",
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
