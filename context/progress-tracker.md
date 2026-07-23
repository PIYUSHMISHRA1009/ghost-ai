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
- 05 — Prisma schema and data layer
- 06 — Project CRUD API & persistence
- 07 — Project UI Wiring & Persistence

## In Progress

- 08 — Editor workspace shell

## Recently Completed

### 07 — Project UI Wiring & Persistence

- **`lib/projects.ts`**: Added `getProjectsForUser(userId, userEmails)` server-side data fetching helper querying owned and shared projects ordered by `updatedAt` descending.
- **`app/api/projects/route.ts`**: Updated `POST /api/projects` endpoint to accept optional `id` parameter in body so project ID and Liveblocks room ID stay 100% aligned.
- **`hooks/use-project-actions.ts`**: Created unified custom hook managing dialog states (`create`, `rename`, `delete`) and project mutations:
  - **Create**: generates short unique suffix, slugifies name, forms `roomId`, calls `POST /api/projects`, navigates to `/editor/${project.id}`.
  - **Rename**: stores target project ID & name, calls `PATCH /api/projects/[id]`, calls `router.refresh()` on success.
  - **Delete**: stores target project, calls `DELETE /api/projects/[id]`, redirects to `/editor` if active workspace is deleted, otherwise calls `router.refresh()`.
- **`components/editor/project-dialogs.tsx`**: Connected dialog forms, inputs, and buttons to `useProjectActions` handlers; added room ID live preview (`Room ID / {roomId}`), disabled inputs and buttons during mutations, and error alerts.
- **`components/editor/project-sidebar.tsx`**: Updated to accept real `ownedProjects` and `sharedProjects` arrays (`Project[]`), wired project items to navigate to workspace `/editor/${project.id}`, and wired context menu options to rename/delete hooks.
- **`components/editor/editor-home-client.tsx`**: Created client component wrapper hosting navbar, sidebar, main empty state, and dialogs.
- **`app/editor/page.tsx`**: Converted `/editor` to a React Server Component fetching owned and shared projects server-side for initial load without client-side fetch latency.

### 06 — Project CRUD API & Persistence

- **`GET /api/projects`**: Lists projects owned by the authenticated Clerk user (`ownerId`), ordered by `updatedAt` descending. Returns `401 Unauthorized` if unauthenticated.
- **`POST /api/projects`**: Creates a project for the authenticated user (`ownerId`). Defaults missing or empty project name to `"Untitled Project"`. Validates client-supplied `rawId` for expected CUID format and length (`/^c[a-z0-9]{24,31}$/i`), falling back to Prisma `@default(cuid())` if invalid or omitted. Wraps `prisma.project.create` in `try/catch` to handle Prisma `P2002` unique constraint collisions gracefully with a `409` conflict response. Returns `401` if unauthenticated.
- **`PATCH /api/projects/[projectId]`**: Renames a project. Enforces ownership check (`project.ownerId === userId`) returning `403 Forbidden` for non-owners, `404 Not Found` if missing, and `400 Bad Request` if `name` is empty. Wraps `prisma.project.update` in `try/catch` to handle Prisma `P2025` error gracefully with a `404` response during concurrent deletions. Returns `401` if unauthenticated.
- **`DELETE /api/projects/[projectId]`**: Deletes a project. Enforces ownership check (`project.ownerId === userId`) returning `403 Forbidden` for non-owners and `404 Not Found` if missing. Wraps `prisma.project.delete` in `try/catch` to handle Prisma `P2025` error gracefully with a `404` response during concurrent deletions. Returns `401` if unauthenticated.
- **`lib/prisma.ts`**: Re-exports `Project`, `ProjectCollaborator`, `ProjectStatus` types for clean type safety across API handlers.
- **Verification**: `npx tsc --noEmit`, `npx eslint`, and `npm run build` all pass cleanly with 0 errors.



### 05 — Prisma Schema And Data Layer

- **`prisma/models/project.prisma`**: Defined `Project` and `ProjectCollaborator` models:
  - `Project`: `ownerId`, `name`, optional `description`, `ProjectStatus` enum (`DRAFT`, `ARCHIVED`), `canvasJsonPath`, timestamps, indexes on `ownerId` and `createdAt`.
  - `ProjectCollaborator`: `projectId` with cascade delete relation, `email`, `createdAt`, unique constraint on `(projectId, email)`, indexes on `email` and `(projectId, createdAt)`.
- **`lib/prisma.ts`**: Implemented cached Prisma Client singleton:
  - Dynamically branches based on `DATABASE_URL`: uses Accelerate extension for `prisma+postgres://` URLs, otherwise instantiates `@prisma/adapter-pg` with `PrismaPg`.
  - Caches client instance on `globalThis` in development for HMR safety.
- **Migration & Client Generation**: Created and ran migration `20260723120910_init_project_models` against PostgreSQL database and generated Prisma Client to `./app/generated/prisma`.
- Verification: `npx tsc --noEmit` and `npm run build` both passed cleanly with 0 errors.



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
- Editor chrome owns sidebar visibility in the client page; app/editor/page.tsx shifts the canvas with marginLeft when the sidebar is open, rather than floating above the canvas.
- Project dialogs are driven by a single `useProjectDialogs` hook at the page level; dialog components are purely presentational.
- Mock project data lives in `project-sidebar.tsx` until API layer is added.
