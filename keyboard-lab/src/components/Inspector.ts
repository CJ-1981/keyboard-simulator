import { store } from '../store/store';
import { getLayout } from '../layouts';
import type { Region } from '../store/types';

const SWATCHES = [
  '#20201d', '#5b533e', '#908d86', '#bfb8a6', '#e9e8e4', '#f7f7f6',
  '#95771c', '#a1854d', '#d4b36a', '#e8c36b',
  '#92443c', '#b0544c', '#d97757',
  '#438c5b', '#5a9b6e', '#7bbd8a',
  '#4f6984', '#557ea7', '#7da3c8',
  '#6042bb', '#8b6fd1', '#b49ae0',
];

/**
 * Right inspector — color picker, legend editor, region presets.
 */
export function renderInspector(root: HTMLElement) {
  root.innerHTML = `
    <aside class="bg-paper border-l border-border overflow-y-auto h-full w-full md:w-72">
      <div class="p-4 border-b border-border">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Selection</div>
        <div id="selection-info" class="text-sm text-ink">No key selected</div>
      </div>

      <div class="p-4 border-b border-border">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Region Presets</div>
        <div class="grid grid-cols-2 gap-2">
          <button data-region="alpha" class="region-btn text-xs px-2 py-1.5 rounded border border-border hover:bg-surface text-ink">Alpha</button>
          <button data-region="mod" class="region-btn text-xs px-2 py-1.5 rounded border border-border hover:bg-surface text-ink">Modifiers</button>
          <button data-region="accent" class="region-btn text-xs px-2 py-1.5 rounded border border-border hover:bg-surface text-ink">Accent</button>
          <button data-region="numpad" class="region-btn text-xs px-2 py-1.5 rounded border border-border hover:bg-surface text-ink">Numpad</button>
          <button data-region="space" class="region-btn text-xs px-2 py-1.5 rounded border border-border hover:bg-surface text-ink">Space</button>
          <button data-region="none" class="region-btn text-xs px-2 py-1.5 rounded border border-border hover:bg-surface text-ink">Clear</button>
        </div>
      </div>

      <div class="p-4 border-b border-border">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Base Color</div>
        <div class="flex items-center gap-2 mb-3">
          <input id="base-color" type="color" class="w-10 h-10 rounded border border-border cursor-pointer" />
          <input id="base-color-hex" type="text" class="flex-1 border border-border rounded px-2 py-1.5 text-sm font-mono" />
        </div>
        <div class="grid grid-cols-6 gap-1.5">
          ${SWATCHES.map((c) => `<button data-color="${c}" data-target="base" class="swatch-btn w-7 h-7 rounded border border-border hover:scale-110 transition-transform" style="background:${c}"></button>`).join('')}
        </div>
      </div>

      <div class="p-4 border-b border-border">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Legend Color</div>
        <div class="flex items-center gap-2 mb-3">
          <input id="legend-color" type="color" class="w-10 h-10 rounded border border-border cursor-pointer" />
          <input id="legend-color-hex" type="text" class="flex-1 border border-border rounded px-2 py-1.5 text-sm font-mono" />
        </div>
        <div class="grid grid-cols-6 gap-1.5">
          ${SWATCHES.map((c) => `<button data-color="${c}" data-target="legend" class="swatch-btn w-7 h-7 rounded border border-border hover:scale-110 transition-transform" style="background:${c}"></button>`).join('')}
        </div>
      </div>

      <div class="p-4">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Legend Text</div>
        <input id="legend-text" type="text" class="w-full border border-border rounded px-2 py-1.5 text-sm" placeholder="(empty = no legend)" maxlength="6" />
        <div class="text-xs text-muted mt-1">Applies to all selected keys. Max 6 chars.</div>
      </div>
    </aside>
  `;

  // ─── Region presets ───
  root.querySelectorAll<HTMLButtonElement>('.region-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const region = btn.dataset.region as Region | 'none';
      if (region === 'none') {
        store.selectRegion(null);
      } else {
        store.selectRegion(region);
        store.applyRegionPreset(region);
      }
    });
  });

  // ─── Color inputs ───
  const baseColor = root.querySelector<HTMLInputElement>('#base-color')!;
  const baseHex = root.querySelector<HTMLInputElement>('#base-color-hex')!;
  const legendColor = root.querySelector<HTMLInputElement>('#legend-color')!;
  const legendHex = root.querySelector<HTMLInputElement>('#legend-color-hex')!;

  baseColor.addEventListener('input', () => {
    baseHex.value = baseColor.value;
    store.applyBaseColor(baseColor.value);
  });
  baseHex.addEventListener('change', () => {
    const v = normalizeHex(baseHex.value);
    if (v) {
      baseColor.value = v;
      baseHex.value = v;
      store.applyBaseColor(v);
    }
  });
  legendColor.addEventListener('input', () => {
    legendHex.value = legendColor.value;
    store.applyLegendColor(legendColor.value);
  });
  legendHex.addEventListener('change', () => {
    const v = normalizeHex(legendHex.value);
    if (v) {
      legendColor.value = v;
      legendHex.value = v;
      store.applyLegendColor(v);
    }
  });

  // ─── Swatch buttons ───
  root.querySelectorAll<HTMLButtonElement>('.swatch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color!;
      const target = btn.dataset.target!;
      if (target === 'base') {
        baseColor.value = color;
        baseHex.value = color;
        store.applyBaseColor(color);
      } else {
        legendColor.value = color;
        legendHex.value = color;
        store.applyLegendColor(color);
      }
    });
  });

  // ─── Legend text ───
  const legendText = root.querySelector<HTMLInputElement>('#legend-text')!;
  legendText.addEventListener('input', () => {
    store.applyLegendText(legendText.value);
  });

  // ─── Re-render on store change ───
  store.subscribe(() => {
    const selInfo = root.querySelector<HTMLElement>('#selection-info')!;
    const sel = store.selectedKeyIds;
    if (sel.length === 0) {
      selInfo.innerHTML = '<span class="text-muted italic">No key selected</span>';
      legendText.value = '';
      legendText.disabled = true;
      baseColor.disabled = true;
      legendColor.disabled = true;
    } else if (sel.length === 1) {
      const layout = getLayout(store.design.layout);
      const def = layout.keys.find((k) => k.id === sel[0]);
      const state = store.design.keycaps.find((k) => k.keyId === sel[0]);
      selInfo.innerHTML = `<span class="font-mono font-semibold">${def?.id ?? sel[0]}</span> <span class="text-muted">· ${def?.region ?? ''}</span>`;
      if (state) {
        baseColor.value = state.baseColor;
        baseHex.value = state.baseColor;
        legendColor.value = state.legendColor;
        legendHex.value = state.legendColor;
        legendText.value = state.legendText;
      }
      legendText.disabled = false;
      baseColor.disabled = false;
      legendColor.disabled = false;
    } else {
      selInfo.innerHTML = `<span class="font-semibold">${sel.length} keys selected</span> <span class="text-muted text-xs">· shift-click to add/remove</span>`;
      legendText.disabled = false;
      baseColor.disabled = false;
      legendColor.disabled = false;
    }
  });
}

function normalizeHex(s: string): string | null {
  const trimmed = s.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return '#' + trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const c = trimmed.slice(1);
    return '#' + c.split('').map((x) => x + x).join('').toLowerCase();
  }
  return null;
}
