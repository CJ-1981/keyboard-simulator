import type { LayoutDef, KeycapState, KeyDef } from '../store/types';
import { computeKeycapGeometry, computeCanvasSize, darkenHex, UNIT_PX, ROW_HEIGHT_PX, KEY_GAP, WALL_DEPTH, CANVAS_PAD } from './iso';

/**
 * Build the SVG markup for an entire keyboard.
 *
 * Each keycap is rendered as 3 polygons (top face, right wall, bottom wall)
 * + a text element for the legend. The whole SVG is returned as a string
 * that can be injected into innerHTML.
 */
export function renderKeyboardSVG(
  layout: LayoutDef,
  keycaps: KeycapState[],
  options: {
    selectedKeyIds?: string[];
    scale?: number;
  } = {},
): { svg: string; width: number; height: number } {
  const stateMap = new Map<string, KeycapState>();
  for (const k of keycaps) stateMap.set(k.keyId, k);

  const selected = new Set(options.selectedKeyIds ?? []);
  const scale = options.scale ?? 1;
  const { w: rawW, h: rawH } = computeCanvasSize(layout.widthU, layout.heightU);
  const width = rawW * scale;
  const height = rawH * scale;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${rawW} ${rawH}" class="keyboard-svg">`,
  );

  // Background plate (subtle, suggests the keyboard chassis)
  const platePad = 16;
  const plateW = rawW + platePad * 2;
  const plateH = rawH + platePad * 2;
  parts.push(
    `<rect x="${-platePad}" y="${-platePad}" width="${plateW}" height="${plateH}" rx="8" fill="#1a1a18" opacity="0.08" />`,
  );

  // Sort keys by row then column so render order is top-to-bottom (painter's algo)
  const sorted = [...layout.keys].sort((a, b) => a.y - b.y || a.x - b.x);

  for (const keydef of sorted) {
    const state = stateMap.get(keydef.id);
    if (!state) continue;
    parts.push(renderKeycapSVG(keydef, state, selected.has(keydef.id)));
  }

  parts.push('</svg>');
  return { svg: parts.join('\n'), width, height };
}

function renderKeycapSVG(def: KeyDef, state: KeycapState, isSelected: boolean): string {
  if (def.shape === 'iso-enter') {
    return renderIsoEnterSVG(def, state, isSelected);
  }
  const geo = computeKeycapGeometry(def.x, def.y, def.w, def.h);
  const wallColor = darkenHex(state.baseColor, 0.7);
  const edgeColor = darkenHex(state.baseColor, 0.5);

  // Selection ring (rendered first, underneath)
  let selectionRing = '';
  if (isSelected) {
    const pad = 3;
    const sx = geo.bbox.x - pad;
    const sy = geo.bbox.y - pad;
    const sw = geo.bbox.w + pad * 2;
    const sh = geo.bbox.h + pad * 2;
    selectionRing = `<rect class="kl-sel-ring" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="3" fill="none" stroke="#95771c" stroke-width="2.5" />`;
  }

  // Top face: rectangle with subtle gradient
  const topX = geo.topFace.x;
  const topY = geo.topFace.y;
  const topW = geo.topFace.w;
  const topH = geo.topFace.h;
  const gradId = `g_${def.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Legend text — sized to fit the keycap
  const legend = state.legendText || '';
  // For wide keys (>= 1.5u) use a slightly larger font; for 1u use 12px
  const fontSize = legend.length > 4 ? 8
    : legend.length > 2 ? 10
    : def.w >= 1.5 ? 12
    : 12;
  const textX = topX + topW / 2;
  const textY = topY + topH / 2;

  return `
  ${selectionRing}
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${darkenHex(state.baseColor, 1.08)}" />
      <stop offset="100%" stop-color="${state.baseColor}" />
    </linearGradient>
  </defs>
  <polygon class="kl-wall-r" points="${geo.rightWall}" fill="${wallColor}" stroke="${edgeColor}" stroke-width="0.5" />
  <polygon class="kl-wall-b" points="${geo.bottomWall}" fill="${darkenHex(state.baseColor, 0.55)}" stroke="${edgeColor}" stroke-width="0.5" />
  <rect class="kl-topface" data-key-id="${def.id}" x="${topX}" y="${topY}" width="${topW}" height="${topH}" rx="3" fill="url(#${gradId})" stroke="${edgeColor}" stroke-width="0.5" style="cursor:pointer" />
  ${legend ? `<text x="${textX}" y="${textY}" font-family="Inter, sans-serif" font-size="${fontSize}" font-weight="600" fill="${state.legendColor}" text-anchor="middle" dominant-baseline="central" style="pointer-events:none">${escapeXml(legend)}</text>` : ''}
  `;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Render an ISO Enter key as a ㄱ-shaped polygon (Korean rieul-kiyeok).
 *
 * The KeyDef's x/y/w/h describes the TOP half of the ㄱ (the wider part).
 * The bottom half is 1u wide and hangs below the LEFT side of the top rect,
 * giving the classic ISO Enter shape:
 *
 *     ┌─────────────────┐   ← top: 1.5u wide (def.w)
 *     │                 │
 *     ├───┐             │   ← step: bottom is only 1u wide, LEFT-aligned
 *     │   │             │
 *     │   │ ←───────────│   ← bottom: narrow, left side
 *     └───┘
 *
 * Polygon points (clockwise from bottom-left of the narrow bottom part):
 *   (x0, y1) → (x_bot_right, y1) → (x_bot_right, y_mid) →
 *   (x1, y_mid) → (x1, y_top) → (x0, y_top) → close
 *
 * Where:
 *   x0 = left edge of top rect = (def.x * UNIT_PX) + CANVAS_PAD + KEY_GAP/2
 *   x1 = right edge of top rect = x0 + def.w * UNIT_PX - KEY_GAP
 *   x_bot_right = x0 + (UNIT_PX - KEY_GAP)  // bottom is 1u wide, LEFT-aligned
 *   y_top = top of top rect = (def.y - 1) * ROW_HEIGHT_PX + CANVAS_PAD + KEY_GAP/2
 *   y_mid = bottom of top rect / top of bottom rect = def.y * ROW_HEIGHT_PX + CANVAS_PAD + KEY_GAP/2
 *   y1 = bottom of bottom rect = y_mid + ROW_HEIGHT_PX - KEY_GAP
 */
function renderIsoEnterSVG(def: KeyDef, state: KeycapState, isSelected: boolean): string {
  const wallColor = darkenHex(state.baseColor, 0.7);
  const edgeColor = darkenHex(state.baseColor, 0.5);
  const gradId = `g_${def.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Compute the 6 corner points of the ㄱ-shape (in viewBox coords)
  const x0 = def.x * UNIT_PX + CANVAS_PAD + KEY_GAP / 2;
  const x1 = x0 + def.w * UNIT_PX - KEY_GAP;
  // Bottom rect is 1u wide, LEFT-aligned to x0
  const x_bot_right = x0 + (UNIT_PX - KEY_GAP);
  const y_top = (def.y - 1) * ROW_HEIGHT_PX + CANVAS_PAD + KEY_GAP / 2;
  const y_mid = def.y * ROW_HEIGHT_PX + CANVAS_PAD + KEY_GAP / 2;
  const y1 = y_mid + ROW_HEIGHT_PX - KEY_GAP;

  // ㄱ-shape polygon points (clockwise from bottom-left of narrow bottom part)
  const polyPoints = [
    `${x0},${y1}`,            // bottom-left of narrow bottom rect
    `${x_bot_right},${y1}`,   // bottom-right of narrow bottom rect
    `${x_bot_right},${y_mid}`,// up to the step
    `${x1},${y_mid}`,         // right along the step to full width
    `${x1},${y_top}`,         // up the right edge to the top
    `${x0},${y_top}`,         // left along the top
  ].join(' ');

  // Selection ring — slightly expanded ㄱ-shape
  let selectionRing = '';
  if (isSelected) {
    const pad = 3;
    const ringPoints = [
      `${x0 - pad},${y1 + pad}`,
      `${x_bot_right + pad},${y1 + pad}`,
      `${x_bot_right + pad},${y_mid - pad}`,
      `${x1 + pad},${y_mid - pad}`,
      `${x1 + pad},${y_top - pad}`,
      `${x0 - pad},${y_top - pad}`,
    ].join(' ');
    selectionRing = `<polygon class="kl-sel-ring" points="${ringPoints}" fill="none" stroke="#95771c" stroke-width="2.5" stroke-linejoin="round" />`;
  }

  // Walls: right wall runs full height (y_top → y1) on the right edge
  const wallRightPoints = [
    `${x1},${y_top}`,
    `${x1 + WALL_DEPTH},${y_top + WALL_DEPTH}`,
    `${x1 + WALL_DEPTH},${y1 + WALL_DEPTH}`,
    `${x1},${y1}`,
  ].join(' ');
  // Bottom wall runs along the bottom edge (x0 → x_bot_right) of the narrow bottom rect
  const wallBottomPoints = [
    `${x0},${y1}`,
    `${x_bot_right},${y1}`,
    `${x_bot_right + WALL_DEPTH},${y1 + WALL_DEPTH}`,
    `${x0 + WALL_DEPTH},${y1 + WALL_DEPTH}`,
  ].join(' ');

  // Legend text — centered on the wider TOP part of the ㄱ
  const legend = state.legendText || '';
  const fontSize = legend.length > 4 ? 8 : legend.length > 2 ? 10 : 12;
  const textX = (x0 + x1) / 2;
  const textY = (y_top + y_mid) / 2;

  return `
  ${selectionRing}
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${darkenHex(state.baseColor, 1.08)}" />
      <stop offset="100%" stop-color="${state.baseColor}" />
    </linearGradient>
  </defs>
  <polygon class="kl-wall-r" points="${wallRightPoints}" fill="${wallColor}" stroke="${edgeColor}" stroke-width="0.5" />
  <polygon class="kl-wall-b" points="${wallBottomPoints}" fill="${darkenHex(state.baseColor, 0.55)}" stroke="${edgeColor}" stroke-width="0.5" />
  <polygon class="kl-topface" data-key-id="${def.id}" points="${polyPoints}" fill="url(#${gradId})" stroke="${edgeColor}" stroke-width="0.5" stroke-linejoin="round" style="cursor:pointer" />
  ${legend ? `<text x="${textX}" y="${textY}" font-family="Inter, sans-serif" font-size="${fontSize}" font-weight="600" fill="${state.legendColor}" text-anchor="middle" dominant-baseline="central" style="pointer-events:none">${escapeXml(legend)}</text>` : ''}
  `;
}
