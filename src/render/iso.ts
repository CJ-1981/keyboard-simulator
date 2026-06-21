// Isometric-ish projection math for keycap rendering.
//
// Design goals:
//   1. A 1u keycap top face should look roughly SQUARE (not 6× wider than tall)
//   2. The "3D" look comes from a side wall on the right + bottom edges
//   3. Rows should be offset slightly to suggest perspective, but not so much
//      that adjacent rows visually drift apart
//
// Coordinate system:
//   - Layout space: (x, y) in 1u units, where 1u = 1 key width.
//   - Screen space: (sx, sy) in pixels.

// ─── Tunable visual constants ──────────────────────────────────────────────

export const UNIT_PX = 52;          // 1u width in screen pixels (slightly smaller to fit 108 on screen)
export const ROW_HEIGHT_PX = 52;    // visual height of one row in screen pixels (matches UNIT_PX → square cells)
export const KEY_GAP = 3;           // visual gap between adjacent keycaps (inset on each side)
export const WALL_DEPTH = 5;        // depth of the side wall (suggests 3D thickness)
export const ROW_STAGGER_PX = 0;    // per-row Y offset (set to 0 = grid-aligned, looks cleaner)
export const CANVAS_PAD = 32;       // padding around the keyboard inside the SVG
                                    // (large enough to fit selection ring stroke + wall depth on all edges)

// ─── Coordinate transform ──────────────────────────────────────────────────

/**
 * Convert layout-space (x, y in 1u units, top-left origin) to screen-space
 * (pixels). Rows are stacked vertically with ROW_HEIGHT_PX between centers.
 */
export function layoutToScreen(x: number, y: number): { sx: number; sy: number } {
  const sx = x * UNIT_PX + CANVAS_PAD;
  const sy = y * ROW_HEIGHT_PX + ROW_STAGGER_PX * y + CANVAS_PAD;
  return { sx, sy };
}

// ─── Keycap geometry ───────────────────────────────────────────────────────

export interface KeycapGeometry {
  /** Top face rect: x, y, w, h (in screen px) */
  topFace: { x: number; y: number; w: number; h: number };
  /** Right wall polygon points */
  rightWall: string;
  /** Bottom wall polygon points */
  bottomWall: string;
  /** Center of the top face — for legend placement */
  center: { x: number; y: number };
  /** Total bounding box { x, y, w, h } including the wall */
  bbox: { x: number; y: number; w: number; h: number };
}

/**
 * Compute the screen-space geometry for a single keycap.
 *
 * The top face is a rectangle whose visual size is UNIT_PX × ROW_HEIGHT_PX
 * minus KEY_GAP on each side. For a 1u key with UNIT_PX=ROW_HEIGHT_PX=52,
 * the top face is 49×49 — visually square. Wider keys (1.25u, 1.5u, 2u, etc.)
 * scale horizontally while keeping the same vertical size, just like real
 * keycaps.
 */
export function computeKeycapGeometry(
  layoutX: number,
  layoutY: number,
  widthU: number,
  _heightU: number,  // unused — all keys are 1u tall in the visual model
): KeycapGeometry {
  const { sx, sy } = layoutToScreen(layoutX, layoutY);
  // Inset by KEY_GAP/2 on each side so adjacent keys have a visible gap
  const topW = widthU * UNIT_PX - KEY_GAP;
  const topH = ROW_HEIGHT_PX - KEY_GAP;

  const x0 = sx + KEY_GAP / 2;
  const y0 = sy + KEY_GAP / 2;
  const x1 = x0 + topW;
  const y1 = y0 + topH;

  // Right wall: parallelogram hanging off the right edge of the top face
  const rightWall = `${x1},${y0} ${x1 + WALL_DEPTH},${y0 + WALL_DEPTH} ${x1 + WALL_DEPTH},${y1 + WALL_DEPTH} ${x1},${y1}`;

  // Bottom wall: parallelogram hanging off the bottom edge
  const bottomWall = `${x0},${y1} ${x1},${y1} ${x1 + WALL_DEPTH},${y1 + WALL_DEPTH} ${x0 + WALL_DEPTH},${y1 + WALL_DEPTH}`;

  return {
    topFace: { x: x0, y: y0, w: topW, h: topH },
    rightWall,
    bottomWall,
    center: { x: x0 + topW / 2, y: y0 + topH / 2 },
    bbox: {
      x: x0,
      y: y0,
      w: topW + WALL_DEPTH,
      h: topH + WALL_DEPTH,
    },
  };
}

/**
 * Compute total SVG canvas dimensions for a layout (in screen px).
 * Adds WALL_DEPTH + CANVAS_PAD on all sides for breathing room.
 */
export function computeCanvasSize(widthU: number, heightU: number): { w: number; h: number } {
  return {
    w: widthU * UNIT_PX + WALL_DEPTH + CANVAS_PAD * 2,
    h: heightU * ROW_HEIGHT_PX + WALL_DEPTH + CANVAS_PAD * 2,
  };
}

// ─── Color utilities ───────────────────────────────────────────────────────

/**
 * Convert a hex color (#RRGGBB) to an RGBA string with given alpha.
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Darken a hex color by a factor (0 = black, 1 = unchanged).
 * Values > 1 lighten the color (clamped to 255).
 */
export function darkenHex(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = Math.min(255, Math.round(parseInt(clean.substring(0, 2), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(clean.substring(2, 4), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(clean.substring(4, 6), 16) * factor));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
