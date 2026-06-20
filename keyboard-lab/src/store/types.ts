// ─── Core domain types ────────────────────────────────────────────────────

export type LayoutId = 'full108' | 'tkl87' | 'percent75' | 'full108-iso' | 'tkl87-iso' | 'percent75-iso';

export type Region = 'alpha' | 'mod' | 'accent' | 'numpad' | 'space' | 'none';

export interface KeyDef {
  /** Stable ID, e.g. 'K00', 'K01' — used as persistence key */
  id: string;
  /** Primary legend shown centered on the keycap */
  legend: string;
  /** Optional secondary legend (front-printed) */
  subLegend?: string;
  /** Logical region for region-based selection */
  region: Region;
  /** Grid position: column (in 0.25u units from left edge of this row's start) */
  x: number;
  /** Grid position: row (0 = top row / function row) */
  y: number;
  /** Width in 1u units (1u = ~19.05mm) */
  w: number;
  /** Height in 1u units (almost always 1) */
  h: number;
  /** Row index used for isometric sculpt calculation (R1-R5) */
  sculptRow: 1 | 2 | 3 | 4 | 5;
}

export interface LayoutDef {
  id: LayoutId;
  name: string;
  /** Total width in 1u units (e.g. 22.5 for full, 18.5 for TKL, 16 for 75%) */
  widthU: number;
  /** Total height in 1u units (usually 6.5 for full, 5.5 for others) */
  heightU: number;
  keys: KeyDef[];
}

export interface KeycapState {
  keyId: string;
  baseColor: string;
  legendColor: string;
  legendText: string;
  subLegend?: string;
}

export interface Design {
  id: string;
  schemaVersion: 1;
  name: string;
  description: string;
  layout: LayoutId;
  keycaps: KeycapState[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignLibraryEntry {
  id: string;
  name: string;
  description: string;
  layout: LayoutId;
  updatedAt: string;
  createdAt: string;
}

export interface ExportEnvelope {
  schemaVersion: 1;
  exportedAt: string;
  appVersion: string;
  design: Design;
}

// ─── UI state ─────────────────────────────────────────────────────────────

export interface SelectionState {
  /** Single selected key ID, or null */
  single: string | null;
  /** Multiple selected key IDs (for shift-click ranges) */
  multi: string[];
  /** Active region preset, or null */
  region: Region | null;
}

export interface UIState {
  currentLayout: LayoutId;
  currentDesignId: string | null;
  unsavedChanges: boolean;
  lastSavedAt: string | null;
  canUndo: boolean;
  canRedo: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────

export const APP_VERSION = '0.1.0';
export const SCHEMA_VERSION = 1 as const;
export const STORAGE_KEY_DESIGNS = 'keyboard-lab:designs';
export const STORAGE_KEY_META = 'keyboard-lab:meta';
export const DB_NAME = 'keyboard-lab';
export const DB_VERSION = 1;
export const STORE_DESIGNS = 'designs';
export const STORE_META = 'meta';
export const MAX_UNDO = 20;

export const DEFAULT_COLORS = {
  baseAlpha: '#e9e8e4',
  baseMod: '#5b533e',
  baseAccent: '#95771c',
  baseNumpad: '#e9e8e4',
  legendAlpha: '#20201d',
  legendMod: '#f7f7f6',
  legendAccent: '#20201d',
  legendNumpad: '#20201d',
};
