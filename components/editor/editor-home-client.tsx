"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/lib/prisma";

interface EditorHomeClientProps {
  initialOwnedProjects: Project[];
  initialSharedProjects: Project[];
}

export function EditorHomeClient({
  initialOwnedProjects,
  initialSharedProjects,
}: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const actions = useProjectActions();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080809",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-geist-sans)",
        overflow: "hidden",
      }}
    >
      {/* Top navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Sidebar */}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={initialOwnedProjects}
        sharedProjects={initialSharedProjects}
        onNewProject={actions.openCreate}
        onRename={actions.openRename}
        onDelete={actions.openDelete}
      />

      {/* Canvas container area */}
      <main
        style={{
          position: "fixed",
          top: 66,
          bottom: 10,
          left: isSidebarOpen ? 244 : 10,
          right: 10,
          zIndex: 10,
          overflow: "hidden",
          boxSizing: "border-box",
          transition: "left 0.2s ease-out",
        }}
      >
        <div
          className="w-full h-full rounded-2xl overflow-hidden border border-[#2a2a30] shadow-2xl relative flex items-center justify-center"
          style={{
            backgroundColor: "#0b0c10",
            boxShadow:
              "0 12px 32px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,180,200,0.05) 0%, transparent 70%), #0b0c10",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              userSelect: "none",
              textAlign: "center",
              maxWidth: 480,
              padding: "0 24px",
            }}
          >
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#f0f0f4",
                letterSpacing: "-0.03em",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Create a project or open an existing one
            </h1>

            <p
              style={{
                fontSize: 13,
                color: "#505060",
                textAlign: "center",
                margin: 0,
                maxWidth: 360,
                lineHeight: 1.65,
              }}
            >
              Start a new architecture workspace, or choose a project from the
              sidebar.
            </p>

            <button
              type="button"
              onClick={actions.openCreate}
              style={{
                marginTop: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 22px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#00c8d4",
                color: "#000",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.15s",
                fontFamily: "var(--font-geist-sans)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#00b5c0")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#00c8d4")
              }
            >
              <Plus style={{ width: 15, height: 15 }} />
              New Project
            </button>
          </div>
        </div>
      </main>

      <ProjectDialogs hook={actions} />
    </div>
  );
}
