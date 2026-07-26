"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/prisma";
import {
  INSET_GUTTER,
  RIGHT_SIDEBAR_WIDTH,
  CANVAS_TOP_OFFSET,
  CANVAS_LEFT_OPEN_OFFSET,
  CANVAS_RIGHT_OPEN_OFFSET,
} from "@/lib/layout-constants";
import { useProjectActions } from "@/hooks/use-project-actions";
import { useShareDialog } from "@/hooks/use-share-dialog";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";
import { type CanvasTemplate } from "@/components/editor/starter-templates";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { AiSidebar } from "@/components/editor/ai-sidebar";
import type { SaveStatus } from "@/hooks/use-canvas-autosave";

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
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const manualSaveRef = useRef<(() => void) | null>(null);

  const canvasRef = useRef<{ importTemplate: (template: CanvasTemplate) => void }>(null);

  const dialogs = useProjectActions({ activeProjectId: project.id });
  const shareDialog = useShareDialog({ projectId: project.id });

  const handleOpenTemplates = useCallback(() => {
    setIsTemplateModalOpen(true);
  }, []);

  const handleTemplateImport = useCallback((template: CanvasTemplate) => {
    canvasRef.current?.importTemplate(template);
  }, []);

  const handleSaveStatusChange = useCallback(
    (status: SaveStatus, triggerSave: () => void) => {
      setSaveStatus(status);
      manualSaveRef.current = triggerSave;
    },
    []
  );

  const handleManualSave = useCallback(() => {
    manualSaveRef.current?.();
  }, []);

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
        onOpenTemplates={handleOpenTemplates}
        hideUserButton={true}
        saveStatus={saveStatus}
        onSave={handleManualSave}
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
            top: CANVAS_TOP_OFFSET,
            bottom: INSET_GUTTER,
            left: isSidebarOpen ? CANVAS_LEFT_OPEN_OFFSET : INSET_GUTTER,
            right: isAiSidebarOpen ? CANVAS_RIGHT_OPEN_OFFSET : INSET_GUTTER,
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
            <CanvasWrapper
              ref={canvasRef}
              roomId={project.id}
              onSaveStatusChange={handleSaveStatusChange}
            />
          </div>
        </main>

        {/* Mobile AI backdrop scrim */}
        {isAiSidebarOpen && (
          <div
            aria-hidden="true"
            onClick={() => setIsAiSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 19,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            className="sm:hidden"
          />
        )}

        {/* Right AI Sidebar */}
        <AiSidebar
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
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
        shareUrl={shareDialog.shareUrl}
        onInviteEmailChange={shareDialog.setInviteEmail}
        onInvite={shareDialog.handleInvite}
        onRemoveCollaborator={shareDialog.handleRemoveCollaborator}
        onCopyLink={shareDialog.handleCopyLink}
      />

      {/* Starter Templates Modal */}
      <StarterTemplatesModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onImport={handleTemplateImport}
      />
    </div>
  );
}
