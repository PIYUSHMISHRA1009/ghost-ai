"use client";

import { useState } from "react";
import { Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/prisma";
import { useProjectActions } from "@/hooks/use-project-actions";
import { useShareDialog } from "@/hooks/use-share-dialog";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";

interface WorkspaceShellClientProps {
  project: Project;
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function WorkspaceShellClient({
  project,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  const dialogs = useProjectActions({ activeProjectId: project.id });
  const shareDialog = useShareDialog({ projectId: project.id });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080809",
        color: "#f0f0f4",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-geist-sans)",
        overflow: "hidden",
      }}
    >
      {/* Top Navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        onShare={shareDialog.openShare}
        isAiSidebarOpen={isAiSidebarOpen}
        onAiSidebarToggle={() => setIsAiSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace Body */}
      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left Projects Sidebar */}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
          onNewProject={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />

        {/* Central Canvas Area */}
        <main
          style={{
            position: "fixed",
            top: 66,
            bottom: 10,
            left: isSidebarOpen ? 244 : 10,
            right: isAiSidebarOpen ? 284 : 10,
            zIndex: 10,
            overflow: "hidden",
            boxSizing: "border-box",
            transition: "left 0.2s ease-out, right 0.2s ease-out",
          }}
        >
          <div
            className="w-full h-full rounded-2xl overflow-hidden border border-[#2a2a30] shadow-2xl relative"
            style={{
              backgroundColor: "#0b0c10",
              boxShadow:
                "0 12px 32px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
            }}
          >
            <CanvasWrapper roomId={project.id} />
          </div>
        </main>

        {/* Right AI Sidebar */}
        <aside
          aria-label="AI Copilot"
          inert={!isAiSidebarOpen ? true : undefined}
          aria-hidden={!isAiSidebarOpen}
          className={cn(
            "fixed right-[10px] z-20 flex flex-col transition-transform duration-200 ease-out rounded-2xl overflow-hidden border border-[#2a2a30] shadow-xl",
            isAiSidebarOpen
              ? "translate-x-0"
              : "translate-x-[calc(100%+20px)] pointer-events-none"
          )}
          style={{
            top: 66,
            bottom: 10,
            width: 262,
            backgroundColor: "#0b0c10",
          }}
        >
          {/* AI Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #1a1a22",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#f0f0f4",
                }}
              >
                AI Copilot
              </span>
              <span style={{ fontSize: 10, color: "#505060" }}>
                Placeholder panel
              </span>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(100,87,249,0.12)",
                border: "1px solid rgba(100,87,249,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles style={{ width: 13, height: 13, color: "#8b82ff" }} />
            </div>
          </div>

          {/* AI Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "14px 12px",
            }}
          >
            {/* Card 1 — Chat surface pending */}
            <div
              style={{
                borderRadius: 10,
                border: "1px solid #252530",
                backgroundColor: "#13141c",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(100,87,249,0.1)",
                    border: "1px solid rgba(100,87,249,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen
                    style={{ width: 14, height: 14, color: "#8b82ff" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#c0c0cc",
                      lineHeight: 1.3,
                    }}
                  >
                    Chat surface pending
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#505060",
                      lineHeight: 1.5,
                    }}
                  >
                    The toggle is wired. Messaging and generation are intentionally out of scope here.
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 — Future Hooks */}
            <div
              style={{
                borderRadius: 10,
                border: "1px solid #252530",
                backgroundColor: "#13141c",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#3a3a50",
                }}
              >
                Future Hooks
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#505060",
                  lineHeight: 1.55,
                }}
              >
                Prompt composer, run status, and architecture guidance will attach to this sidebar.
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Project Mutation Dialogs */}
      <ProjectDialogs hook={dialogs} />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={shareDialog.isOpen}
        onClose={shareDialog.closeShare}
        projectName={project.name}
        isOwner={shareDialog.isOwner}
        owner={shareDialog.owner}
        collaborators={shareDialog.collaborators}
        inviteEmail={shareDialog.inviteEmail}
        isLoading={shareDialog.isLoading}
        isInviting={shareDialog.isInviting}
        deletingId={shareDialog.deletingId}
        error={shareDialog.error}
        isCopied={shareDialog.isCopied}
        onInviteEmailChange={shareDialog.setInviteEmail}
        onInvite={shareDialog.handleInvite}
        onRemoveCollaborator={shareDialog.handleRemoveCollaborator}
        onCopyLink={shareDialog.handleCopyLink}
      />
    </div>
  );
}
