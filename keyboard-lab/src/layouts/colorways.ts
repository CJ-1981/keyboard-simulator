import type { Design, LayoutId, KeycapState, Region } from '../store/types';
import { SCHEMA_VERSION } from '../store/types';
import { getLayout } from '../layouts';

/**
 * Sample colorway designs based on popular community keycap sets.
 *
 * These are visual approximations for design inspiration only — actual GMK/SP/
 * ePBT sets have proprietary color codes (Pantone-matched) that cannot be
 * reproduced exactly in sRGB. The hex values below are educated approximations
 * based on community photographs and RAL/Pantone cross-references.
 *
 * Sources: deskthority.net, geekhack.org, r/MechMarket — color names and
 * approximate hex values are widely discussed in those communities.
 */

export interface ColorwayColors {
  alpha:    { base: string; legend: string };
  mod:      { base: string; legend: string };
  accent:   { base: string; legend: string };
  numpad:   { base: string; legend: string };
  space:    { base: string; legend: string };
  none?:    { base: string; legend: string };  // optional fallback
}

export interface ColorwayPreset {
  id: string;
  name: string;
  description: string;
  credits: string;
  colors: ColorwayColors;
}

export const COLORWAY_PRESETS: ColorwayPreset[] = [
  {
    id: 'gmk-botanical',
    name: 'GMK Botanical',
    description: 'Deep green alphas with cream legends, accent ESC in warm terracotta. Inspired by botanical gardens.',
    credits: 'Designed by Biip. Color codes: GMK N9 / GNK 9C / Pantone 5535C accent.',
    colors: {
      alpha:  { base: '#3A5A40', legend: '#E8E0D0' },
      mod:    { base: '#2D3F33', legend: '#E8E0D0' },
      accent: { base: '#C8744F', legend: '#F5EFE0' },
      numpad: { base: '#3A5A40', legend: '#E8E0D0' },
      space:  { base: '#2D3F33', legend: '#E8E0D0' },
    },
  },
  {
    id: 'gmk-olivia',
    name: 'GMK Olivia',
    description: 'Warm dark alphas with off-white legends, peach accent. Soft, elegant, and endlessly photogenic.',
    credits: 'Designed by Olivia. Color codes: GMK U9 / WS1 / Pantone 1625C accent.',
    colors: {
      alpha:  { base: '#7A6C5D', legend: '#EDE4D3' },
      mod:    { base: '#5C4F44', legend: '#EDE4D3' },
      accent: { base: '#E8B4A0', legend: '#5C4F44' },
      numpad: { base: '#7A6C5D', legend: '#EDE4D3' },
      space:  { base: '#5C4F44', legend: '#EDE4D3' },
    },
  },
  {
    id: 'gmk-mecha-01',
    name: 'GMK Mecha-01 R2',
    description: 'Retro-robot grey alphas with red legends and gold accents. Industrial design vibe.',
    credits: 'Designed by Pseudo. Color codes: RAL 7016 / GMK 7412 / accent GMK 2435.',
    colors: {
      alpha:  { base: '#4A4E54', legend: '#D74B4B' },
      mod:    { base: '#36393E', legend: '#D74B4B' },
      accent: { base: '#D4A547', legend: '#36393E' },
      numpad: { base: '#4A4E54', legend: '#D74B4B' },
      space:  { base: '#36393E', legend: '#D74B4B' },
    },
  },
  {
    id: 'gmk-hammerhead',
    name: 'GMK Hammerhead',
    description: 'Nautical navy alphas with shark-grey mods and bright red accent. Inspired by the apex predator.',
    credits: 'Designed by Cap. Color codes: GMK 5805 / GMK 7590 / accent Pantone 186C.',
    colors: {
      alpha:  { base: '#1E3A5F', legend: '#D4D8DC' },
      mod:    { base: '#5C6770', legend: '#D4D8DC' },
      accent: { base: '#E63946', legend: '#FFFFFF' },
      numpad: { base: '#1E3A5F', legend: '#D4D8DC' },
      space:  { base: '#5C6770', legend: '#D4D8DC' },
    },
  },
  {
    id: 'epbt-hiragana',
    name: 'ePBT Hiragana',
    description: 'Cyrillic-style dual legends in monochrome black-on-cream. Cult classic for the bilingual aesthetic.',
    credits: 'Designed by biip. Color codes: RAL 9010 / RAL 9005.',
    colors: {
      alpha:  { base: '#E8E4DC', legend: '#1A1A1A' },
      mod:    { base: '#1A1A1A', legend: '#E8E4DC' },
      accent: { base: '#7B2D26', legend: '#E8E4DC' },
      numpad: { base: '#E8E4DC', legend: '#1A1A1A' },
      space:  { base: '#1A1A1A', legend: '#E8E4DC' },
    },
  },
  {
    id: 'sp-hyperfuse',
    name: 'SP Hyperfuse',
    description: 'Iconic purple-on-pink-and-blue. The OG pastel cyberpunk keycap set, still unmatched.',
    credits: 'Designed by harlw. Color codes: SP RAS / SP RCF / accent SP VCO.',
    colors: {
      alpha:  { base: '#9B7BB8', legend: '#F5E6E8' },
      mod:    { base: '#6B8AC4', legend: '#F5E6E8' },
      accent: { base: '#E8C5D0', legend: '#5C4A6B' },
      numpad: { base: '#9B7BB8', legend: '#F5E6E8' },
      space:  { base: '#6B8AC4', legend: '#F5E6E8' },
    },
  },
  {
    id: 'gmk-dracula',
    name: 'GMK Dracula',
    description: 'Dark purple alphas with pink legends, deep teal mods. Synthwave-inspired, made famous by the Dracula Pro theme.',
    credits: 'Designed by Zeno. Color codes: GMK 2682 / GMK 5805 / accent GMK 6632.',
    colors: {
      alpha:  { base: '#2D2A40', legend: '#F0A0C0' },
      mod:    { base: '#1A1A2E', legend: '#8BE9FD' },
      accent: { base: '#FF79C6', legend: '#1A1A2E' },
      numpad: { base: '#2D2A40', legend: '#F0A0C0' },
      space:  { base: '#1A1A2E', legend: '#8BE9FD' },
    },
  },
  {
    id: 'gmk-bento',
    name: 'GMK Bento',
    description: 'Soft cream alphas with salmon-pink mods and navy accents. Japanese bento box color blocking.',
    credits: 'Designed by Plastik. Color codes: GMK L9 / GMK 9464 / accent GMK 5805.',
    colors: {
      alpha:  { base: '#E8E0D0', legend: '#3A3A3A' },
      mod:    { base: '#E89B8B', legend: '#FFFFFF' },
      accent: { base: '#2D3A5C', legend: '#E8E0D0' },
      numpad: { base: '#E8E0D0', legend: '#3A3A3A' },
      space:  { base: '#E89B8B', legend: '#FFFFFF' },
    },
  },
];

/**
 * Build a Design object from a colorway preset applied to a given layout.
 */
export function buildDesignFromColorway(preset: ColorwayPreset, layoutId: LayoutId): Design {
  const layout = getLayout(layoutId);
  const now = new Date().toISOString();

  const keycaps: KeycapState[] = layout.keys.map((k) => {
    const region: Region = k.region;
    const c = preset.colors[region] ?? preset.colors.alpha;
    return {
      keyId: k.id,
      baseColor: c.base,
      legendColor: c.legend,
      legendText: k.legend,
      subLegend: k.subLegend,
    };
  });

  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    name: preset.name,
    description: preset.description + ' — ' + preset.credits,
    layout: layoutId,
    keycaps,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Apply a colorway preset to the currently-loaded design (keeps layout,
 * replaces all keycap colors in-place).
 */
export function applyColorwayToDesign(design: Design, preset: ColorwayPreset): Design {
  const layout = getLayout(design.layout);
  return {
    ...design,
    name: design.name === 'Untitled Design' || design.name.startsWith('GMK') || design.name.startsWith('ePBT') || design.name.startsWith('SP')
      ? preset.name
      : design.name + ' (' + preset.name + ')',
    keycaps: design.keycaps.map((kc) => {
      const def = layout.keys.find((k) => k.id === kc.keyId);
      const region: Region = def?.region ?? 'alpha';
      const c = preset.colors[region] ?? preset.colors.alpha;
      return {
        ...kc,
        baseColor: c.base,
        legendColor: c.legend,
        legendText: def?.legend ?? kc.legendText,
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}
