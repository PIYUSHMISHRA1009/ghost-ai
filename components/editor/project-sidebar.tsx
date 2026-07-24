"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Plus, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/prisma";
import type { ProjectDialogTarget } from "@/hooks/use-project-actions";
import {
  CANVAS_TOP_OFFSET,
  INSET_GUTTER,
  LEFT_SIDEBAR_WIDTH,
} from "@/lib/layout-constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects?: Project[];
  sharedProjects?: Project[];
  activeProjectId?: string;
  onNewProject: () => void;
  onRename: (project: ProjectDialogTarget) => void;
  onDelete: (project: ProjectDialogTarget) => void;
}

type Tab = "my-projects" | "shared";

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <p style={{ fontSize: 12, color: "#505060", textAlign: "center" }}>
        {message}
      </p>
    </div>
  );
}

interface ProjectItemProps {
  project: Project;
  isOwned: boolean;
  isActive: boolean;
  onRename: (project: ProjectDialogTarget) => void;
  onDelete: (project: ProjectDialogTarget) => void;
}

function ProjectItem({
  project,
  isOwned,
  isActive,
  onRename,
  onDelete,
}: ProjectItemProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleSelect = () => {
    router.push(`/editor/${project.id}`);
  };

  return (
    <div
      onClick={handleSelect}
      className={`group relative flex items-center gap-2 cursor-pointer transition-all ${
        isActive
          ? "bg-[rgba(0,200,212,0.12)] border border-[rgba(0,200,212,0.25)]"
          : "bg-transparent border border-transparent hover:bg-white/[0.03]"
      }`}
      style={{
        padding: "8px 12px",
        margin: "2px 8px",
        borderRadius: 12,
      }}
    >
      {/* Dot */}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: isActive ? "#00c8d4" : "#2a2a30",
          boxShadow: isActive ? "0 0 8px rgba(0,200,212,0.7)" : "none",
        }}
      />

      {/* Project name */}
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: isActive ? "#00c8d4" : "#c0c0cc",
          fontWeight: isActive ? 500 : 400,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        {project.name}
      </span>

      {/* Context menu button — owned projects only */}
      {isOwned && (
        <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            aria-label={`Actions for ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className={`flex items-center justify-center w-[22px] h-[22px] rounded-[5px] border-0 bg-transparent text-[#505060] hover:bg-[#2a2a30] hover:text-[#c0c0cc] cursor-pointer p-0 transition-all ${
              menuOpen ? "opacity-100 bg-[#2a2a30] text-[#c0c0cc]" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <MoreHorizontal style={{ width: 13, height: 13 }} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                zIndex: 60,
                minWidth: 128,
                background: "#18181c",
                border: "1px solid #2a2a30",
                borderRadius: 10,
                padding: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onRename({ id: project.id, name: project.name });
                }}
                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-[7px] border-0 bg-transparent hover:bg-[#1e1e23] text-[#c0c0cc] text-[13px] cursor-pointer text-left transition-colors"
              >
                <Pencil style={{ width: 12, height: 12, color: "#808090" }} />
                Rename
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete({ id: project.id, name: project.name });
                }}
                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-[7px] border-0 bg-transparent hover:bg-[#3c1618] text-[#ff4d4f] text-[13px] cursor-pointer text-left transition-colors"
              >
                <Trash2 style={{ width: 12, height: 12 }} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects = [],
  sharedProjects = [],
  activeProjectId,
  onNewProject,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (
      activeProjectId &&
      sharedProjects.some((p) => p.id === activeProjectId) &&
      !ownedProjects.some((p) => p.id === activeProjectId)
    ) {
      return "shared";
    }
    return "my-projects";
  });

  const projects =
    activeTab === "my-projects" ? ownedProjects : sharedProjects;
  const isOwnedTab = activeTab === "my-projects";

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 39,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          className="sm:hidden"
        />
      )}

      <aside
        inert={!isOpen ? true : undefined}
        aria-hidden={!isOpen}
        aria-label="Projects"
        className={cn(
          "fixed left-[10px] z-40 flex flex-col transition-transform duration-200 ease-out rounded-2xl overflow-hidden border border-[#2a2a30] shadow-xl",
          isOpen ? "translate-x-0" : "pointer-events-none -translate-x-[calc(100%+20px)]"
        )}
        style={{
          top: CANVAS_TOP_OFFSET,
          bottom: INSET_GUTTER,
          width: LEFT_SIDEBAR_WIDTH,
          backgroundColor: "#0b0c10",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px 12px",
            borderBottom: "1px solid #1a1a22",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#f0f0f4",
              letterSpacing: "-0.01em",
            }}
          >
            Projects
          </span>
          <button
            aria-label="Close projects sidebar"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: "#505060",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#1e1e23")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "transparent")
            }
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Tabs — matches reference: pill container, active = white text on dark fill */}
        <div
          style={{
            display: "flex",
            gap: 2,
            margin: "10px 12px 8px",
            padding: "3px",
            backgroundColor: "#18181c",
            borderRadius: 8,
            border: "1px solid #222228",
          }}
        >
          {(["my-projects", "shared"] as Tab[]).map((tab) => {
            const label = tab === "my-projects" ? "My Projects" : "Shared";
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "5px 0",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                  backgroundColor: isActive ? "#2a2a32" : "transparent",
                  color: isActive ? "#f0f0f4" : "#505060",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            paddingTop: 4,
          }}
        >
          {projects.length === 0 ? (
            <EmptyState
              message={
                activeTab === "my-projects"
                  ? "No projects yet."
                  : "No shared projects yet."
              }
            />
          ) : (
            projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                isOwned={isOwnedTab}
                isActive={project.id === activeProjectId}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {/* Footer — Avatar + New Project button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px 14px",
            borderTop: "1px solid #1a1a22",
          }}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-[#2a2a30]",
              },
            }}
          />
          <button
            type="button"
            onClick={onNewProject}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flex: 1,
              height: 34,
              borderRadius: 16,
              border: "none",
              backgroundColor: "#00c8d4",
              color: "#000",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: "var(--font-geist-sans)",
              letterSpacing: "0.01em",
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
            <Plus style={{ width: 13, height: 13 }} />
            New Project
          </button>
        </div>
      </aside>
    </>
  );
}
