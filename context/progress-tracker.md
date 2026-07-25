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
- 14 — Node editing (resizing & inline label editing)
- 15 — Floating node color toolbar
- 16 — Canvas edges & connections
- 17 — Canvas ergonomics
- 18 — Starter templates

## In Progress


## Recently Completed

### 18 — Import Template Dialog Redesign

- **`components/editor/starter-templates-modal.tsx`**: Completely redesigned the "Import Template" dialog box to match the reference image:
  - Charcoal dark surface modal (`#12131a`, `rounded-[24px]`, `border border-[#252634]`).
  - Styled `⌘Z` undo keyboard shortcut badge in header description.
  - Custom top-right circular close button.
  - 3-column side-by-side template card grid for Microservices, CI/CD Pipeline, and Event-Driven System.
  - Custom SVG diagram graphics for each template preview matching the node layouts in the reference image.
  - Dark outline `Import` action button with download icon.
- **`components/editor/starter-templates.tsx`**: Updated template descriptions to match the exact text from the reference image.
- **Verification**: `npx tsc --noEmit` passes cleanly with 0 errors.

### 16 — Canvas Edges & Connections

- **`types/canvas.ts`**: Added `CanvasEdgeData` interface with optional `label` field and updated `CanvasEdge` type to use it.
- **`components/editor/canvas-edge.tsx`**: Created custom edge renderer using `getSmoothStepPath` for right-angle routing. Edges are dimmed at rest (`#4a4a56`, 1.5px) and brighten on hover/select (`#c0c0cc` / `#00c8d4`, 2px). Added invisible 20px transparent hit area for easier hover/click. Arrowhead marker dynamically matches stroke color. Inline label editing via `EdgeLabelRenderer`: double-click to edit, saves on blur/Enter, cancels on Escape. Saved labels render as small pill badges. When an edge is selected with no label, shows faint "Double-click to add label" hint. Label editing interactions are isolated with `nodrag nopan`.
- **`components/editor/canvas-flow.tsx`**: Registered custom `canvasEdge` type in `edgeTypes`. Wrapped `onConnect` to assign `type: CANVAS_EDGE_TYPE` to new connections via `onEdgesChange`. Imported `Connection` type from `@xyflow/react`.
- **`components/editor/canvas-node.tsx`**: Added source handles on top and left sides, and target handles on right and bottom sides, enabling any-to-any handle connectivity. All 8 handles share the same subtle white-dot-with-dark-border styling, hidden by default and revealed on hover.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.

### 17 — Canvas Ergonomics

- **`hooks/useKeyboardShortcuts.ts`**: Created `useKeyboardShortcuts` hook receiving the React Flow instance plus undo and redo callbacks. Listens on `window` for keyboard shortcuts and skips handling while focus is inside `INPUT`, `TEXTAREA`, or any `contenteditable` element. Wired `+`/`=` to zoom in, `-` to zoom out, `Cmd/Ctrl+Z` to undo, and `Cmd/Ctrl+Shift+Z` / `Cmd/Ctrl+Y` to redo. Calls `preventDefault` for matched shortcuts to avoid browser conflicts.
- **`components/editor/canvas-controls.tsx`**: Added pill-shaped control bar at the bottom-left of the canvas via React Flow's `<Panel position="bottom-left">`. Contains two button groups separated by a thin divider: zoom (zoom out, fit view, zoom in) and history (undo, redo). Zoom actions call `reactFlowInstance.zoomIn`, `zoomOut`, and `fitView` with `{ duration: 200 }` animation. Undo and redo use Liveblocks history hooks (`useCanUndo`, `useCanRedo`, `useUndo`, `useRedo`) and are disabled with `opacity: 0.4` and `cursor: not-allowed` when no history is available.
- **`components/editor/canvas-flow.tsx`**: Imported and rendered `<CanvasControls />` before `<ShapePanel />` so the control bar floats above the shape panel.
- **Scope**: No changes to shape panel, node/edge rendering, or collaborative state setup.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.

### 18 — Starter Templates

- **`components/editor/starter-templates.ts`**: Defined `CanvasTemplate` interface (`id`, `name`, `description`, `nodes`, `edges`) and exported `CANVAS_TEMPLATES` array with 3 predefined templates: `microservices` (API Gateway, 3 services, Message Queue, Database), `cicd` (Git Repo, Build, Test, Deploy, Monitor, Alert), and `event-driven` (Event Source, Event Bus, 2 Processors, Data Sink, Cache). Each template uses the shared canvas types, `NODE_COLORS` palette, and helper functions (`createNode`, `createEdge`) for readability.
- **`components/editor/starter-templates-modal.tsx`**: Created modal using shadcn `Dialog` with a scrollable grid of template cards. Each card renders a lightweight SVG preview that computes bounds from node positions, scales to a fixed 240×140 viewport, draws edges as simple lines between node centers, and draws nodes using their shape and color data (supports rectangle, pill, circle, diamond, cylinder, hexagon). Cards display name, description, and an `Import` button wired to `onImport`.
- **`components/editor/editor-navbar.tsx`**: Added `onOpenTemplates` prop and a `Templates` button with `FolderOpen` icon to the right action group.
- **`components/editor/workspace-shell-client.tsx`**: Manages `isTemplateModalOpen` state and a `canvasRef` forwarded through `CanvasWrapper` to `CanvasFlow`. Renders `<StarterTemplatesModal>` and handles `handleTemplateImport` by calling `canvasRef.current?.importTemplate(template)`.
- **`components/editor/canvas-wrapper.tsx`**: Changed to `forwardRef` to forward the ref to `CanvasFlow`.
- **`components/editor/canvas-flow.tsx`**: Changed to `forwardRef` and exposed `importTemplate` via `useImperativeHandle`. When a template is imported, it first removes all existing nodes and edges, then adds the template nodes and edges, and finally calls `fitView({ duration: 200 })` via `requestAnimationFrame`.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.

### 15 — Floating Node Color Toolbar

- **`components/editor/canvas-node.tsx`**: Integrated `@xyflow/react`'s `<NodeToolbar>` positioned at `Position.Top` floating above selected nodes without overlapping. Displays 8 swatches corresponding to `NODE_COLORS` palette. Added active state styling (white border, cyan `#00c8d4` ring, and inner text-color dot) and tight text-color glow effect on hover (`boxShadow` tuned to `color.text`). Wired swatch clicks to update `data.color` via `useReactFlow().setNodes`, updating node fill and matching text color live across the collaborative Liveblocks canvas. Attached `nodrag nopan` to isolate toolbar interactions from canvas dragging or panning.
- **Toolbar usability refinement**: Increased color buttons from `h-9 w-9` (36px) to `h-11 w-11` (44px) for comfortable click targets, widened gap from `gap-2.5` to `gap-3`, and increased toolbar padding from `px-4 py-2.5` to `px-5 py-3`. Ensures icons are clearly visible and click targets are generous, consistent with modern design tools.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.

### 14 — Node Editing (Resizing & Inline Label Editing)

- **`components/editor/canvas-node.tsx`**: Integrated `@xyflow/react`'s `<NodeResizer>` for selected nodes with cyan (`#00c8d4`) handles and lines enforcing a minimum node boundary of 60px width × 40px height. Added inline label editing triggered via double-click on the node shape/label area, rendering a centered `<textarea>` with `nodrag nopan` classes to isolate text editing from canvas dragging or panning. Wired label input updates to `useReactFlow().setNodes`, syncing changes live via `onNodesChange` to Liveblocks storage. Configured blur, `Escape`, and `Enter` keypresses to close editing, and rendered centered italic placeholder (`Type a label...`) when labels are empty.
- **Verification**: `npx tsc --noEmit` and `npm run build` both pass with 0 errors.

### 14 — Canvas Node Shape Rendering Fix

- **`components/editor/canvas-node.tsx`**: Added `h-full w-full` to the `className` of `div`-based shape renderers (`circle`, `pill`, `rectangle`) in `renderShapeGeometry()`. This ensures empty `div` elements stretch to 100% width and height of their parent node container (e.g., 160px × 80px), matching the behavior of SVG-based shapes (`cylinder`, `diamond`, `hexagon`) and preventing `0px × 0px` box collapse on the main canvas.
- **`components/editor/canvas-node.tsx`**: Re-applied `h-full w-full` to the `className` of `div`-based shape renderers (`circle`, `pill`, `rectangle`) in `renderShapeGeometry()`. This ensures empty `div` elements stretch to 100% width and height of their parent node container (e.g., 160px × 80px), matching the behavior of SVG-based shapes (`cylinder`, `diamond`, `hexagon`) and preventing `0px × 0px` box collapse on the main canvas.
- **Verification**: `npx tsc --noEmit` passed with 0 errors. All 6 supported node shapes now render with exact geometry matching the MiniMap.

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
