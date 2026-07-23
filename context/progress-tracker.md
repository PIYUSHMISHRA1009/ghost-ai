# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation

## Current Goal

- Build editor canvas and block interactions.

## Completed

- 01 — Design system and UI primitives
- 02 — Editor chrome
- 03 — Authentication
- 04 — Project dialogs & editor home

## In Progress

- 05 — Editor canvas / block interactions

## Recently Completed

### 04 — Project Dialogs & Editor Home

- **Editor home empty state**: centered heading ("Create a project or open an existing one"), description, and cyan `New Project` button with Plus icon inside `<main>`. No cards, no extra wrappers.
- **`hooks/use-project-dialogs.ts`**: dedicated hook managing `dialogState` (kind + target), `name` input, live `slug` preview (slugified from name as user types), `isLoading`, and actions: `openCreate`, `openRename(project)`, `openDelete(project)`, `close`, `setName`.
- **`components/editor/project-dialogs.tsx`**: three dialog components (`CreateProjectDialog`, `RenameProjectDialog`, `DeleteProjectDialog`) driven by the hook. Rename auto-focuses input; Create shows live slug below the input; Delete uses red destructive button. All rendered as a single `<ProjectDialogs hook={...} />`.
- **`components/editor/project-sidebar.tsx`**: added mock project data (3 owned + 1 shared). Each owned project item shows a `MoreHorizontal` context menu on hover with Rename and Delete actions. Shared projects have no context menu. Mobile backdrop scrim added (closes sidebar on tap, `sm:hidden`). Sidebar footer New Project button wired to `onNewProject` prop.
- **`app/editor/page.tsx`**: instantiates `useProjectDialogs`, passes `openCreate`/`openRename`/`openDelete` to `<ProjectSidebar>`, renders `<ProjectDialogs hook={dialogs} />` at page level.
- Wiring: editor home New Project → Create dialog; sidebar New Project → Create dialog; sidebar rename → Rename dialog; sidebar delete → Delete dialog.
- TypeScript: zero errors. ESLint: zero errors.

### Editor Chrome (02)

- `EditorNavbar`: full-width dark top bar (`#111114`), sidebar toggle left, UserButton right
- `ProjectSidebar`: fixed-left column (200px wide, top=56px to bottom), dark bg, "Projects" header + X close, custom white-pill active tabs (My Projects / Shared), minimal "No projects yet." empty state, cyan New Project button pinned at footer
- `EditorPage`: canvas area (`#000000`) shifts right by 200px when sidebar open, synchronized 200ms transition

### Authentication (03)

- Completely rebuilt Auth UI from scratch — full pixel-accurate match to reference image (two-column 100vh layout).
- Left Marketing Panel (`#0B0C14` navy bg, cyan `G` logo, large bold hero heading, slate description, 3 circular feature icon rows `#0D2129` bg / cyan icon, bottom copyright `#3D4E57`).
- Right Authentication Panel (`#000000` pure black, centered 430px auth card `#0A0A0F` + `border-white/[0.07]`, 2-column GitHub/Google social buttons `#141419`, `or` divider, email input, cyan `#00C8D4` Continue button with `▶`, Clerk branding + amber Development mode label).
- Preserved 100% of authentication functionality (Clerk Sign In / Sign Up, OAuth providers, email auth, routing, middleware, session handling, forceRedirectUrl to /editor).
- Globals.css Clerk overrides updated: amber Development mode badge, transparent card boxes, font inheritance.
- TypeScript: zero errors after rebuild.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui uses the Radix Nova preset with a dark-only token theme defined in `app/globals.css`.
- Editor chrome owns sidebar visibility in the client page; the sidebar floats above the canvas rather than shifting it.
- Project dialogs are driven by a single `useProjectDialogs` hook at the page level; dialog components are purely presentational.
- Mock project data lives in `project-sidebar.tsx` until API layer is added.
