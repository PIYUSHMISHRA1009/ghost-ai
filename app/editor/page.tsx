"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dialogs = useProjectDialogs();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top navbar — fixed, full width */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Sidebar */}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={dialogs.openCreate}
        onRename={dialogs.openRename}
        onDelete={dialogs.openDelete}
      />

      {/* Canvas area — shifts right when sidebar is open */}
      <main
        style={{
          marginTop: 56, // below fixed navbar
          marginLeft: isSidebarOpen ? 200 : 0,
          flex: 1,
          minHeight: "calc(100vh - 56px)",
          backgroundColor: "#000000",
          transition: "margin-left 0.2s ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Editor home empty state */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            userSelect: "none",
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#f0f0f4",
              letterSpacing: "-0.02em",
              textAlign: "center",
              margin: 0,
            }}
          >
            Create a project or open an existing one
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#808090",
              textAlign: "center",
              margin: 0,
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            Start a new architecture workspace, or choose a project from the
            sidebar.
          </p>

          <button
            type="button"
            onClick={dialogs.openCreate}
            style={{
              marginTop: 4,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 20px",
              borderRadius: 10,
              border: "none",
              backgroundColor: "#00c8d4",
              color: "#000",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
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
            <Plus style={{ width: 16, height: 16 }} />
            New Project
          </button>
        </div>
      </main>

      {/* Project dialogs — rendered at page level */}
      <ProjectDialogs hook={dialogs} />
    </div>
  );
}
