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
- 08 — Editor workspace shell
- 09 — Share dialog
- 10 — Liveblocks setup
- 11 — Base canvas
- 12 — Shape panel & canvas node creation
- 13 — Node shape rendering & drag preview

## In Progress

- 14 — Canvas node interactions

## Recently Completed

### 13 — Node Shape Rendering & Drag Preview

- **`components/editor/canvas-node.tsx`**: Replaced placeholder node rendering with dedicated shape renderers for all 6 variants: CSS shapes for `rectangle` (`rounded-lg`), `pill` (`rounded-full`), and `circle` (`rounded-full`), and SVG shapes for `diamond`, `hexagon`, and `cylinder`. Borders styled with subtle `#3a3a42` at rest and cyan glow `#00c8d4` when selected.
- **`components/editor/shape-panel.tsx`**: Added HTML5 `setDragImage` ghost preview attached to cursor during drag. Dynamically generates preview matching dragged shape, default dimensions (`width` x `height`), fill color, and border with 75% opacity, automatically cleaning up temporary DOM nodes.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.


### 12 — Shape Panel & Canvas Node Creation

- **`components/editor/canvas-flow.tsx`**: Updated drag-and-drop handlers to invoke Liveblocks-compliant `onNodesChange([{ type: "add", item: newNode }])` alongside React Flow instance node insertion, guaranteeing immediate sync with Liveblocks Storage. Added `onDragOver` and `onDrop` directly to `<ReactFlow>` and parent wrapper.
- **`components/editor/shape-panel.tsx`**: Configured draggable shape items with `pointerEvents: "none"` on internal icons and multi-MIME payload support (`application/reactflow` and `text/plain`) for 100% drag reliability across all browsers. Refactored `ShapePanel` to use React Flow's native `<Panel position="bottom-center">` component with explicit inline dark theme styling and `z-index: 1000`.
- **`components/editor/canvas-node.tsx`**: Built `CanvasNodeComponent` renderer enforcing explicit width and height dimensions and explicit border styling (`border: 1.5px solid ${borderColor}`) to guarantee all 6 shape types (`rectangle`, `diamond`, `circle`, `pill`, `cylinder`, `hexagon`) render with crisp geometry.
- **`components/editor/canvas-wrapper.tsx`**: Wrapped `<CanvasFlow />` inside `<ReactFlowProvider>` so `useReactFlow()` works seamlessly throughout the canvas component tree.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.

### 13 — Inset Canvas & Dual Sidebar Dynamic Layout

- **`components/editor/workspace-shell-client.tsx`**: Updated canvas container (`main`) layout to use fixed positioning with dynamic `left` (264px when left sidebar open, 12px when closed) and dynamic `right` (304px when AI sidebar open, 12px when closed) with a smooth `0.2s` CSS transition.
- **`components/editor/editor-home-client.tsx`**: Applied matching dynamic inset canvas panel layout for `/editor` home view.
- **Sidebars & Canvas Alignment**:
  - When both sidebars are open (Image 1), left sidebar (240px), center canvas panel, and right AI sidebar (280px) sit side-by-side with uniform 12px gaps and 12px top/bottom margins below the 56px navbar.
  - When both sidebars are closed (Image 2), center canvas dynamically expands to fill the viewport maintaining a uniform 12px inset border margin around all edges.
- **Verification**: `npx tsc --noEmit` passes cleanly with 0 errors.

### 14 — Comprehensive Code & Documentation Review Remediation

- **Layout System (`lib/layout-constants.ts`)**: Centralized `NAVBAR_HEIGHT`, `INSET_GUTTER`, `LEFT_SIDEBAR_WIDTH`, `RIGHT_SIDEBAR_WIDTH`, and derived `CANVAS_TOP_OFFSET` / `CANVAS_BOTTOM_OFFSET` across all editor shell views and sidebars.
- **Canvas & Flow Architecture (`types/canvas.ts`, `components/editor/canvas-flow.tsx`, `components/editor/canvas-node.tsx`, `components/editor/canvas-wrapper.tsx`, `components/editor/shape-panel.tsx`)**:
  - Removed `as const` from `NODE_COLORS` / `NODE_SHAPES`.
  - Replaced collision-prone ID counters with `crypto.randomUUID()`.
  - Removed duplicate `reactFlowInstance.addNodes` call in `onDrop`.
  - Cleaned edge types cast.
  - Merged shape cases in node renderer.
  - Added `onError` error reporting callback to `<ErrorBoundary>`.
  - Added viewport center shape creation supporting click and keyboard (Enter/Space).
- **Backend APIs & Auth (`app/api/projects/[projectId]/collaborators/[collaboratorId]/route.ts`, `app/api/projects/[projectId]/collaborators/route.ts`, `app/sign-in/[[...sign-in]]/page.tsx`, `app/editor/[roomId]/page.tsx`)**:
  - Scoped collaborator deletion by both `id` and `projectId`.
  - Extracted reusable `resolveClerkDisplayName` helper for collaborator and owner name resolution.
  - Updated Clerk `forceRedirectUrl` to `fallbackRedirectUrl` and added `redirect_url` search parameter to unauthenticated sign-in redirects.
- **UI & Share Dialog (`hooks/use-share-dialog.ts`, `components/editor/share-dialog.tsx`, `components/editor/project-sidebar.tsx`, `components/editor/project-dialogs.tsx`, `components/editor/editor-navbar.tsx`, `components/editor/workspace-shell-client.tsx`)**:
  - Single derived `shareUrl` passed to dialog for guaranteed URL consistency.
  - Derived initial `activeTab` from `activeProjectId` and `sharedProjects`.
  - Replaced imperative JS style mutations with Tailwind hover and focus utility classes.
- **Documentation & References (`.agents/skills/liveblocks-best-practices/`)**: Corrected typos, code fences, rules of hooks violations, missing async/await, Lexical editor type & format dispatch commands (`FORMAT_TEXT_COMMAND`), and type annotations across reference docs and skill definition.

### 10 — Liveblocks Setup

- **`liveblocks.config.ts`** (project root): Defines the Liveblocks global type augmentation. `Presence` carries `cursor: { x, y } | null` and `isThinking: boolean`. `UserMeta` carries `id`, `info.name`, `info.avatar`, and `info.color`.
- **`lib/liveblocks.ts`**: Exports a cached `Liveblocks` node client singleton (stored on `globalThis` in development for HMR safety). Also exports `getUserCursorColor(userId)` — a djb2-style hash that maps any Clerk user ID to a deterministic color from a fixed 10-color palette.
- **`app/api/liveblocks-auth/route.ts`**: `POST /api/liveblocks-auth` auth endpoint. Requires Clerk authentication (401 if not signed in). Reads `room` from the request body. Calls `getProjectAccess` to verify the user is owner or collaborator (403 if not). Calls `getOrCreateRoom` to ensure the Liveblocks room exists. Issues an access-token session via `prepareSession` with `name`, `avatar`, and `color` in `userInfo`, granting `FULL_ACCESS` to the specific room.
- **Packages installed**: `@liveblocks/client`, `@liveblocks/react`, `@liveblocks/node`.
- **Verification**: `npx tsc --noEmit` passes with 0 errors.

### 09 — Share Dialog

- **`GET /api/projects/[projectId]/collaborators`**: Lists project owner and collaborators (`ProjectCollaborator`), enriched with display names and avatar images from Clerk Backend API (`clerkClient().users.getUserList`). Enforces owner/collaborator access.
- **`POST /api/projects/[projectId]/collaborators`**: Owner-only endpoint to invite collaborators by email into PostgreSQL with `P2002` duplicate collision handling.
- **`DELETE /api/projects/[projectId]/collaborators/[collaboratorId]`**: Owner-only endpoint to remove collaborators.
- **`hooks/use-share-dialog.ts`**: Created hook managing share dialog state, fetching profiles, invite/delete mutations, and project link copy feedback.
- **`components/editor/share-dialog.tsx`**: Built share modal component supporting owner invite form, copy link button with temporary `Copied!` feedback, Clerk avatars, and read-only view for non-owner collaborators.
- **`components/editor/workspace-shell-client.tsx`**: Integrated Share dialog with top navbar `Share` button.

### 08 — Editor Workspace Shell

- **`lib/project-access.ts`**: Created access authorization helper (`getProjectAccess`) that resolves Clerk user identity (`userId` + primary email) and verifies project membership against `ownerId` or `collaborators`.
- **`components/editor/access-denied.tsx`**: Created centered `AccessDenied` view featuring a lock icon badge, access message, and dark cyan return button navigating back to `/editor`.
- **`components/editor/editor-navbar.tsx`**: Updated top navbar to render project title, Share button, and AI sidebar toggle button when in workspace view.
- **`components/editor/workspace-shell-client.tsx`**: Created client workspace shell managing `isSidebarOpen` and `isAiSidebarOpen` states, project sidebar integration with `activeProjectId`, dark canvas placeholder area, and collapsible right AI sidebar.
- **`app/editor/[roomId]/page.tsx`**: Implemented server component route for `/editor/[roomId]` enforcing server-side auth redirect, project access authorization, initial project data loading, and fallback to `<AccessDenied />`.

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
