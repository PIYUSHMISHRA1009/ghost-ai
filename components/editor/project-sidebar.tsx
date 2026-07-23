"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/prisma";
import type { ProjectDialogTarget } from "@/hooks/use-project-actions";

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
      <p style={{ fontSize: 13, color: "#505060", textAlign: "center" }}>
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

  // Close menu when clicking outside
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
      className="group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
      style={{
        transition: "background 0.12s",
        backgroundColor: isActive ? "#1e1e23" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLDivElement).style.background = "#1e1e23";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      {/* Project name */}
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: isActive ? "#f0f0f4" : "#c0c0cc",
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: "#505060",
              cursor: "pointer",
              padding: 0,
              opacity: menuOpen ? 1 : undefined,
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#2a2a30")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "transparent")
            }
          >
            <MoreHorizontal style={{ width: 13, height: 13 }} />
          </button>

          {/* Dropdown menu */}
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 7,
                  border: "none",
                  background: "transparent",
                  color: "#c0c0cc",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
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
                <Pencil style={{ width: 12, height: 12, color: "#808090" }} />
                Rename
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete({ id: project.id, name: project.name });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 7,
                  border: "none",
                  background: "transparent",
                  color: "#ff4d4f",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#3c1618")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "transparent")
                }
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
  const [activeTab, setActiveTab] = useState<Tab>("my-projects");

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
        aria-hidden={!isOpen}
        aria-label="Projects"
        className={cn(
          "fixed left-0 z-40 flex flex-col transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"
        )}
        style={{
          top: 56,
          bottom: 0,
          width: 200,
          backgroundColor: "#111114",
          borderRight: "1px solid #1e1e23",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px 10px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#f0f0f4",
              letterSpacing: "-0.005em",
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "0 12px 10px",
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
                  borderRadius: 8,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                  backgroundColor: isActive ? "#f0f0f4" : "transparent",
                  color: isActive ? "#080809" : "#808090",
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
            padding: "0 4px",
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

        {/* Footer — New Project button */}
        <div
          style={{
            padding: "10px 12px 12px",
            borderTop: "1px solid #1e1e23",
          }}
        >
          <button
            type="button"
            onClick={onNewProject}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              height: 36,
              borderRadius: 8,
              border: "none",
              backgroundColor: "#00c8d4",
              color: "#000",
              fontSize: 13,
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
            <Plus style={{ width: 14, height: 14 }} />
            New Project
          </button>
        </div>
      </aside>
    </>
  );
}
