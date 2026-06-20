import type {
  Design,
  KeycapState,
  LayoutId,
  Region,
} from './types';
import {
  APP_VERSION,
  SCHEMA_VERSION,
  MAX_UNDO,
  DEFAULT_COLORS,
} from './types';
import { getLayout } from '../layouts';
import { saveDesign as dbSave, getDesign as dbGet } from '../persistence/db';
import {
  buildDesignFromColorway,
  applyColorwayToDesign,
  type ColorwayPreset,
} from '../layouts/colorways';

type Listener = () => void;

/**
 * Observable store — the single source of truth for app state.
 *
 * Components subscribe via `subscribe()` and re-render themselves when notified.
 * State mutations happen exclusively through command methods (applyColor, etc.)
 * which push the previous state onto the undo stack.
 */
class Store {
  private listeners = new Set<Listener>();
  private undoStack: Design[] = [];
  private redoStack: Design[] = [];

  // ─── Current state ───
  design: Design = createEmptyDesign('percent75');
  selectedKeyIds: string[] = [];
  selectedRegion: Region | null = null;
  lastSavedAt: string | null = null;
  isDirty: boolean = false;
  libraryVersion: number = 0;  // bumped when library changes (for sidebar re-render)

  // ─── Subscription ───
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    for (const fn of this.listeners) fn();
  }

  // ─── Selection ───
  selectKey(keyId: string | null, additive: boolean = false) {
    if (keyId === null) {
      this.selectedKeyIds = [];
      this.selectedRegion = null;
    } else if (additive) {
      const i = this.selectedKeyIds.indexOf(keyId);
      if (i >= 0) this.selectedKeyIds.splice(i, 1);
      else this.selectedKeyIds.push(keyId);
    } else {
      this.selectedKeyIds = [keyId];
      this.selectedRegion = null;
    }
    this.notify();
  }

  selectRegion(region: Region | null) {
    this.selectedRegion = region;
    if (region === null) {
      // keep current selection
    } else {
      const layout = getLayout(this.design.layout);
      this.selectedKeyIds = layout.keys
        .filter((k) => k.region === region)
        .map((k) => k.id);
    }
    this.notify();
  }

  // ─── Layout switching ───
  setLayout(layoutId: LayoutId) {
    this.pushUndo();
    const newDesign = createEmptyDesign(layoutId);
    newDesign.name = this.design.name;
    newDesign.description = this.design.description;
    newDesign.id = this.design.id;
    newDesign.createdAt = this.design.createdAt;
    this.design = newDesign;
    this.selectedKeyIds = [];
    this.selectedRegion = null;
    this.isDirty = true;
    this.notify();
  }

  // ─── Color & legend mutations ───
  applyBaseColor(color: string) {
    if (this.selectedKeyIds.length === 0) return;
    this.pushUndo();
    for (const id of this.selectedKeyIds) {
      this.mutateKey(id, (k) => ({ ...k, baseColor: color }));
    }
    this.isDirty = true;
    this.notify();
  }

  applyLegendColor(color: string) {
    if (this.selectedKeyIds.length === 0) return;
    this.pushUndo();
    for (const id of this.selectedKeyIds) {
      this.mutateKey(id, (k) => ({ ...k, legendColor: color }));
    }
    this.isDirty = true;
    this.notify();
  }

  applyLegendText(text: string) {
    if (this.selectedKeyIds.length === 0) return;
    this.pushUndo();
    for (const id of this.selectedKeyIds) {
      this.mutateKey(id, (k) => ({ ...k, legendText: text }));
    }
    this.isDirty = true;
    this.notify();
  }

  applyRegionPreset(region: Region) {
    this.pushUndo();
    const layout = getLayout(this.design.layout);
    const baseColor =
      region === 'alpha' ? DEFAULT_COLORS.baseAlpha :
      region === 'mod' ? DEFAULT_COLORS.baseMod :
      region === 'accent' ? DEFAULT_COLORS.baseAccent :
      region === 'numpad' ? DEFAULT_COLORS.baseNumpad :
      DEFAULT_COLORS.baseAlpha;
    const legendColor =
      region === 'alpha' ? DEFAULT_COLORS.legendAlpha :
      region === 'mod' ? DEFAULT_COLORS.legendMod :
      region === 'accent' ? DEFAULT_COLORS.legendAccent :
      region === 'numpad' ? DEFAULT_COLORS.legendNumpad :
      DEFAULT_COLORS.legendAlpha;

    for (const def of layout.keys) {
      if (def.region !== region) continue;
      this.mutateKey(def.id, (k) => ({
        ...k,
        baseColor,
        legendColor,
        // Keep existing legend text — region preset only changes colors
      }));
    }
    this.isDirty = true;
    this.notify();
  }

  // ─── Save / Load ───
  async save(name?: string, description?: string) {
    if (name !== undefined) this.design.name = name;
    if (description !== undefined) this.design.description = description;
    this.design.updatedAt = new Date().toISOString();
    await dbSave(this.design);
    this.lastSavedAt = this.design.updatedAt;
    this.isDirty = false;
    this.libraryVersion++;
    this.notify();
  }

  async loadDesign(id: string) {
    const d = await dbGet(id);
    if (d) {
      this.design = d;
      this.selectedKeyIds = [];
      this.selectedRegion = null;
      this.lastSavedAt = d.updatedAt;
      this.isDirty = false;
      this.undoStack = [];
      this.redoStack = [];
      this.libraryVersion++;
      this.notify();
    }
  }

  newDesign(layoutId: LayoutId = this.design.layout) {
    this.design = createEmptyDesign(layoutId);
    this.selectedKeyIds = [];
    this.selectedRegion = null;
    this.lastSavedAt = null;
    this.isDirty = false;
    this.undoStack = [];
    this.redoStack = [];
    this.notify();
  }

  /** Replace the current design with an externally-provided one (e.g. import). */
  loadDesignObject(design: Design) {
    this.design = design;
    this.selectedKeyIds = [];
    this.selectedRegion = null;
    this.isDirty = false;
    this.lastSavedAt = design.updatedAt;
    this.undoStack = [];
    this.redoStack = [];
    this.libraryVersion++;
    this.notify();
  }

  // ─── Colorway presets ───

  /** Apply a colorway preset to the current design (keeps layout, replaces colors). */
  applyColorway(preset: ColorwayPreset) {
    this.pushUndo();
    this.design = applyColorwayToDesign(this.design, preset);
    this.isDirty = true;
    this.notify();
  }

  /** Load a colorway preset as a brand-new design (replaces everything). */
  loadColorwayAsNew(preset: ColorwayPreset, layoutId: LayoutId = this.design.layout) {
    this.pushUndo();
    this.design = buildDesignFromColorway(preset, layoutId);
    this.selectedKeyIds = [];
    this.selectedRegion = null;
    this.isDirty = true;
    this.lastSavedAt = null;
    this.notify();
  }

  // ─── Undo / Redo ───
  private pushUndo() {
    this.undoStack.push(JSON.parse(JSON.stringify(this.design)));
    if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
    this.redoStack = [];
  }

  undo() {
    const prev = this.undoStack.pop();
    if (!prev) return;
    this.redoStack.push(JSON.parse(JSON.stringify(this.design)));
    this.design = prev;
    this.isDirty = true;
    this.notify();
  }

  redo() {
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(JSON.parse(JSON.stringify(this.design)));
    this.design = next;
    this.isDirty = true;
    this.notify();
  }

  get canUndo() { return this.undoStack.length > 0; }
  get canRedo() { return this.redoStack.length > 0; }

  // ─── Internal ───
  private mutateKey(keyId: string, fn: (k: KeycapState) => KeycapState) {
    const idx = this.design.keycaps.findIndex((k) => k.keyId === keyId);
    if (idx >= 0) {
      this.design.keycaps[idx] = fn(this.design.keycaps[idx]);
    }
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────

export function createEmptyDesign(layoutId: LayoutId): Design {
  const layout = getLayout(layoutId);
  const now = new Date().toISOString();
  const keycaps: KeycapState[] = layout.keys.map((k) => ({
    keyId: k.id,
    baseColor: getDefaultBaseColor(k.region),
    legendColor: getDefaultLegendColor(k.region),
    legendText: k.legend,
    subLegend: k.subLegend,
  }));
  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    name: 'Untitled Design',
    description: '',
    layout: layoutId,
    keycaps,
    createdAt: now,
    updatedAt: now,
  };
}

function getDefaultBaseColor(region: Region): string {
  switch (region) {
    case 'alpha': return DEFAULT_COLORS.baseAlpha;
    case 'mod': return DEFAULT_COLORS.baseMod;
    case 'accent': return DEFAULT_COLORS.baseAccent;
    case 'numpad': return DEFAULT_COLORS.baseNumpad;
    case 'space': return DEFAULT_COLORS.baseAlpha;
    default: return DEFAULT_COLORS.baseAlpha;
  }
}

function getDefaultLegendColor(region: Region): string {
  switch (region) {
    case 'alpha': return DEFAULT_COLORS.legendAlpha;
    case 'mod': return DEFAULT_COLORS.legendMod;
    case 'accent': return DEFAULT_COLORS.legendAccent;
    case 'numpad': return DEFAULT_COLORS.legendNumpad;
    case 'space': return DEFAULT_COLORS.legendAlpha;
    default: return DEFAULT_COLORS.legendAlpha;
  }
}

export const store = new Store();
