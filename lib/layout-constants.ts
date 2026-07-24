/**
 * Shared layout dimension constants.
 *
 * Centralizes top navbar height, sidebar widths, and inset canvas gutters
 * so the editor workspace shell, home screen, top bar, and sidebars remain
 * 100% aligned and synchronized.
 */

export const NAVBAR_HEIGHT = 56;
export const INSET_GUTTER = 10;
export const LEFT_SIDEBAR_WIDTH = 220;
export const RIGHT_SIDEBAR_WIDTH = 262;

/** Computed top offset for sidebars and canvas (NAVBAR_HEIGHT + INSET_GUTTER) */
export const CANVAS_TOP_OFFSET = NAVBAR_HEIGHT + INSET_GUTTER;

/** Computed left offset for canvas when left sidebar is open (LEFT_SIDEBAR_WIDTH + INSET_GUTTER * 2.4) */
export const CANVAS_LEFT_OPEN_OFFSET = LEFT_SIDEBAR_WIDTH + 24;

/** Computed right offset for canvas when right AI sidebar is open (RIGHT_SIDEBAR_WIDTH + INSET_GUTTER * 2.2) */
export const CANVAS_RIGHT_OPEN_OFFSET = RIGHT_SIDEBAR_WIDTH + 22;
