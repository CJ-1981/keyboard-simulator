// Isometric projection math for keycap rendering.
//
// Each keycap is drawn as a parallelogram top-face + a side wall (right + bottom
// edges). The "isometric" look comes from skewing the top face by ~25° on the X
// axis and adding a small drop shadow underneath.
//
// Coordinate system:
//   - Layout space: (x, y) in 1u units, where 1u ≈ 56px on screen.
//   - Screen space: (sx, sy) in pixels, derived by applying the iso transform.

export const UNIT_PX = 56;        // 1u in screen pixels
export const KEY_GAP = 4;          // visual gap between adjacent keycaps
export const ISO_SKEW_Y = 0.18;    // vertical compression factor for isometric look
export const ISO_SHIFT_Y = 14;     // additional Y shift per row (the "3D lean")
export const CAP_HEIGHT = 38;      // visible height of the keycap top face
export const WALL_DEPTH = 6;       // depth of the side wall (suggests 3D)
export const LEGEND_FONT_PX = 11;

/**
 * Convert layout-space (x, y in 1u units, top-left origin) to screen-space
 * (pixels, with isometric skew applied).
 */
export function layoutToScreen(x: number, y: number): { sx: number; sy: number } {
  const sx = x * UNIT_PX;
  // Each row shifts down a tiny bit more (pseudo-3D lean) and compresses vertically
  const sy = y * UNIT_PX * ISO_SKEW_Y + y * ISO_SHIFT_Y + 40;
  return { sx, sy };
}

export interface KeycapGeometry {
  /** Top face polygon points (4 corners) in screen px */
  topFace: string;
  /** Right wall polygon points */
  rightWall: string;
  /** Bottom wall polygon points */
  bottomWall: string;
  /** Center of the top face — for legend placement */
  center: { x: number; y: number };
  /** Total bounding box { x, y, w, h } */
  bbox: { x: number; y: number; w: number; h: number };
}

/**
 * Compute the screen-space geometry for a single keycap.
 * Layout coords are in 1u units; we apply gap inset to leave visual breathing room.
 */
export function computeKeycapGeometry(
  layoutX: number,
  layoutY: number,
  widthU: number,
  heightU: number,
): KeycapGeometry {
  const { sx: x0, sy: y0 } = layoutToScreen(layoutX, layoutY);
  const w = widthU * UNIT_PX - KEY_GAP;
  const h = heightU * UNIT_PX * ISO_SKEW_Y - KEY_GAP / 2;
  const x1 = x0 + w;
  const y1 = y0 + h;

  // Top face: a rectangle (we keep it rectilinear — true iso would skew the rect,
  // but rect-with-3D-wall reads as iso enough and stays legible).
  const topFace = `${x0},${y0} ${x1},${y0} ${x1},${y1} ${x0},${y1}`;

  // Right wall: from top-right corner, going down by WALL_DEPTH
  const rightWall = `${x1},${y0} ${x1 + WALL_DEPTH},${y0 + WALL_DEPTH} ${x1 + WALL_DEPTH},${y1 + WALL_DEPTH} ${x1},${y1}`;

  // Bottom wall: from bottom-left to bottom-right, going down by WALL_DEPTH
  const bottomWall = `${x0},${y1} ${x1},${y1} ${x1 + WALL_DEPTH},${y1 + WALL_DEPTH} ${x0 + WALL_DEPTH},${y1 + WALL_DEPTH}`;

  const center = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
  const bbox = {
    x: x0,
    y: y0,
    w: w + WALL_DEPTH,
    h: h + WALL_DEPTH,
  };

  return { topFace, rightWall, bottomWall, center, bbox };
}

/**
 * Compute total SVG canvas dimensions for a layout (in screen px).
 */
export function computeCanvasSize(widthU: number, heightU: number): { w: number; h: number } {
  const { sx, sy } = layoutToScreen(widthU, heightU);
  return {
    w: sx + WALL_DEPTH + 20,
    h: sy + WALL_DEPTH + 20,
  };
}

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
 */
export function darkenHex(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = Math.round(parseInt(clean.substring(0, 2), 16) * factor);
  const g = Math.round(parseInt(clean.substring(2, 4), 16) * factor);
  const b = Math.round(parseInt(clean.substring(4, 6), 16) * factor);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
