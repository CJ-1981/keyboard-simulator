import type { LayoutDef, KeycapState, KeyDef } from '../store/types';
import { computeKeycapGeometry, computeCanvasSize, darkenHex } from './iso';

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
  const topX = geo.bbox.x;
  const topY = geo.bbox.y;
  const topW = geo.bbox.w - 6;  // subtract wall depth
  const topH = geo.bbox.h - 6;
  const gradId = `g_${def.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Legend text — sized to fit the keycap
  const legend = state.legendText || '';
  const fontSize = legend.length > 4 ? 8 : legend.length > 2 ? 9 : 11;
  const textX = topX + topW / 2;
  const textY = topY + topH / 2 + fontSize / 3;

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
  <rect class="kl-topface" data-key-id="${def.id}" x="${topX}" y="${topY}" width="${topW}" height="${topH}" rx="2.5" fill="url(#${gradId})" stroke="${edgeColor}" stroke-width="0.5" style="cursor:pointer" />
  ${legend ? `<text x="${textX}" y="${textY}" font-family="Inter, sans-serif" font-size="${fontSize}" font-weight="600" fill="${state.legendColor}" text-anchor="middle" dominant-baseline="middle" style="pointer-events:none">${escapeXml(legend)}</text>` : ''}
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
