"use client";

import { FolderOpen, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function EmptyProjects({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <FolderOpen className="h-8 w-8 text-copy-faint" />
      <div className="space-y-1">
        <p className="font-medium text-copy-primary">No {label} projects</p>
        <p className="text-sm text-copy-muted">Your projects will appear here.</p>
      </div>
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Projects"
      className={cn(
        "fixed bottom-4 left-4 top-[calc(3.5rem+1rem)] z-40 flex w-80 flex-col rounded-2xl border border-surface-border bg-surface shadow-2xl transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "pointer-events-none -translate-x-[calc(100%+1rem)]"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="font-medium text-copy-primary">Projects</h2>
        <Button aria-label="Close projects sidebar" onClick={onClose} size="icon-sm" variant="ghost">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs className="min-h-0 flex-1 p-3" defaultValue="my-projects">
        <TabsList className="w-full">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent className="flex h-full" value="my-projects">
          <EmptyProjects label="personal" />
        </TabsContent>
        <TabsContent className="flex h-full" value="shared">
          <EmptyProjects label="shared" />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-3">
        <Button className="w-full" type="button">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
