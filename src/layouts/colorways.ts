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
  // ─── GMK Modern Classics ───────────────────────────────────────────────
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
    description: 'Warm dark alphas with off-white legends, peach accent. Soft, elegant, endlessly photogenic.',
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
    id: 'gmk-olivia-dark',
    name: 'GMK Olivia Dark',
    description: 'Dark monochrome version of Olivia. Charcoal alphas with light legends, peach accent ESC for contrast.',
    credits: 'Designed by Olivia. Color codes: GMK N9 / WS1 / Pantone 1625C accent.',
    colors: {
      alpha:  { base: '#1F1F23', legend: '#E8E4DC' },
      mod:    { base: '#0F0F12', legend: '#E8E4DC' },
      accent: { base: '#E8B4A0', legend: '#1F1F23' },
      numpad: { base: '#1F1F23', legend: '#E8E4DC' },
      space:  { base: '#0F0F12', legend: '#E8E4DC' },
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
  {
    id: 'gmk-mono',
    name: 'GMK Mono',
    description: 'Pure monochrome black-on-white. Timeless, professional, goes with any build.',
    credits: 'Designed by biip. Color codes: GMK WS1 / GMK N9 / accent GMK 2435.',
    colors: {
      alpha:  { base: '#F0EDE5', legend: '#1A1A1A' },
      mod:    { base: '#1A1A1A', legend: '#F0EDE5' },
      accent: { base: '#D4A547', legend: '#1A1A1A' },
      numpad: { base: '#F0EDE5', legend: '#1A1A1A' },
      space:  { base: '#1A1A1A', legend: '#F0EDE5' },
    },
  },
  {
    id: 'gmk-noir',
    name: 'GMK Noir',
    description: 'Stealth black-on-black with subtle grey legends. Premium, understated, a little menacing.',
    credits: 'Designed by Zambumon. Color codes: GMK N9 / Pantone 7540 / accent Pantone 425C.',
    colors: {
      alpha:  { base: '#1A1A1D', legend: '#5A5A5F' },
      mod:    { base: '#0D0D10', legend: '#5A5A5F' },
      accent: { base: '#7B2D26', legend: '#1A1A1D' },
      numpad: { base: '#1A1A1D', legend: '#5A5A5F' },
      space:  { base: '#0D0D10', legend: '#5A5A5F' },
    },
  },
  {
    id: 'gmk-ta-royal-alpha',
    name: 'GMK TA Royal Alpha',
    description: 'Cream alphas with navy mods and brick-red accents. Retro typewriter vibe.',
    credits: 'Designed by T0mb3ry. Color codes: GMK L9 / GMK 5805 / accent Pantone 7621C.',
    colors: {
      alpha:  { base: '#E8E0CC', legend: '#2D3A5C' },
      mod:    { base: '#2D3A5C', legend: '#E8E0CC' },
      accent: { base: '#A0432F', legend: '#E8E0CC' },
      numpad: { base: '#E8E0CC', legend: '#2D3A5C' },
      space:  { base: '#2D3A5C', legend: '#E8E0CC' },
    },
  },
  {
    id: 'gmk-dolch',
    name: 'GMK Dolch',
    description: 'The OG. Charcoal alphas with light grey legends. The set that started the modern keycap craze.',
    credits: 'Designed by Taeyoung Kim. Original: Cherry Corp on original Dolch PAC keyboards. GMK codes: N9 / CC / 7412.',
    colors: {
      alpha:  { base: '#3A3D44', legend: '#C8CDD2' },
      mod:    { base: '#25272B', legend: '#C8CDD2' },
      accent: { base: '#8B1F1F', legend: '#E8E4DC' },
      numpad: { base: '#3A3D44', legend: '#C8CDD2' },
      space:  { base: '#25272B', legend: '#C8CDD2' },
    },
  },
  {
    id: 'gmk-hyperfuse',
    name: 'GMK Hyperfuse',
    description: 'Iconic purple-on-pink-and-blue. Pastel cyberpunk classic originally on SP profile.',
    credits: 'Designed by harlw. Original SP codes: RAS / RCF / VCO. GMK version uses GMK 2682 / 9418 / 9415.',
    colors: {
      alpha:  { base: '#9B7BB8', legend: '#F5E6E8' },
      mod:    { base: '#6B8AC4', legend: '#F5E6E8' },
      accent: { base: '#E8C5D0', legend: '#5C4A6B' },
      numpad: { base: '#9B7BB8', legend: '#F5E6E8' },
      space:  { base: '#6B8AC4', legend: '#F5E6E8' },
    },
  },
  {
    id: 'gmk-nautilus',
    name: 'GMK Nautilus',
    description: 'Nautical navy with cyan accents and cream legends. Inspired by 20,000 Leagues Under the Sea.',
    credits: 'Designed by Zambumon. Color codes: GMK 5805 / WS1 / accent Pantone 319C.',
    colors: {
      alpha:  { base: '#1E3A5F', legend: '#E8E4DC' },
      mod:    { base: '#2C5F8A', legend: '#E8E4DC' },
      accent: { base: '#5BC0BE', legend: '#1A1A1A' },
      numpad: { base: '#1E3A5F', legend: '#E8E4DC' },
      space:  { base: '#2C5F8A', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-merlin',
    name: 'GMK Merlin',
    description: 'Royal purple alphas with gold accents. Magical, mystical, a touch Arthurian.',
    credits: 'Designed by pmh. Color codes: GMK 6635 / GMK N9 / accent Pantone 871C.',
    colors: {
      alpha:  { base: '#4A3F6B', legend: '#E8E4DC' },
      mod:    { base: '#2D2545', legend: '#E8E4DC' },
      accent: { base: '#D4A547', legend: '#2D2545' },
      numpad: { base: '#4A3F6B', legend: '#E8E4DC' },
      space:  { base: '#2D2545', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-awakening',
    name: 'GMK Awakening',
    description: 'Soft beige alphas with olive mods and red accent. Korean barbecue-inspired warmth.',
    credits: 'Designed by Liano. Color codes: GMK L9 / V4 / accent Pantone 7427C.',
    colors: {
      alpha:  { base: '#E8DECA', legend: '#3A3A3A' },
      mod:    { base: '#5A6A4F', legend: '#E8DECA' },
      accent: { base: '#9B3232', legend: '#E8DECA' },
      numpad: { base: '#E8DECA', legend: '#3A3A3A' },
      space:  { base: '#5A6A4F', legend: '#E8DECA' },
    },
  },
  {
    id: 'gmk-coral',
    name: 'GMK Coral',
    description: 'Coral-pink alphas with cream legends and teal accents. Beachy, fresh, summer vibes.',
    credits: 'Designed by Jangbi. Color codes: GMK 5250 / WS1 / accent Pantone 7471C.',
    colors: {
      alpha:  { base: '#E8836B', legend: '#FDF6E3' },
      mod:    { base: '#FDF6E3', legend: '#3A3A3A' },
      accent: { base: '#2A9D8F', legend: '#FDF6E3' },
      numpad: { base: '#E8836B', legend: '#FDF6E3' },
      space:  { base: '#FDF6E3', legend: '#3A3A3A' },
    },
  },
  {
    id: 'gmk-peach-blossom',
    name: 'GMK Peach Blossom',
    description: 'Pale pink alphas with deep green mods and crimson accent. Spring blossom aesthetic.',
    credits: 'Designed by ramencup. Color codes: GMK 5250 / GMK 5805 / accent Pantone 185C.',
    colors: {
      alpha:  { base: '#F5D7D0', legend: '#3A3A3A' },
      mod:    { base: '#2D4A3E', legend: '#F5D7D0' },
      accent: { base: '#C8443C', legend: '#F5D7D0' },
      numpad: { base: '#F5D7D0', legend: '#3A3A3A' },
      space:  { base: '#2D4A3E', legend: '#F5D7D0' },
    },
  },
  {
    id: 'gmk-terramoto',
    name: 'GMK Terramoto',
    description: 'Earth-toned browns with cream legends and amber accent. Natural, grounded, autumnal.',
    credits: 'Designed by Glory. Color codes: GMK 7112 / WS1 / accent Pantone 1245C.',
    colors: {
      alpha:  { base: '#6B4A2B', legend: '#E8DEC2' },
      mod:    { base: '#3A2818', legend: '#E8DEC2' },
      accent: { base: '#D49B4B', legend: '#3A2818' },
      numpad: { base: '#6B4A2B', legend: '#E8DEC2' },
      space:  { base: '#3A2818', legend: '#E8DEC2' },
    },
  },
  {
    id: 'gmk-deku',
    name: 'GMK Deku',
    description: 'Hero green alphas with red accents and dark grey mods. My Hero Academia-inspired.',
    credits: 'Designed by dmpo. Color codes: GMK 5805 / GMK N9 / accent Pantone 485C.',
    colors: {
      alpha:  { base: '#2D5A3F', legend: '#E8E4DC' },
      mod:    { base: '#1A1A1D', legend: '#E8E4DC' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#2D5A3F', legend: '#E8E4DC' },
      space:  { base: '#1A1A1D', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-wob',
    name: 'GMK WoB',
    description: 'Classic White-on-Black. Every keyboard enthusiast has owned a set of WoB at some point.',
    credits: 'Designed by the community. Color codes: GMK WS1 / GMK N9 / accent GMK 2435.',
    colors: {
      alpha:  { base: '#1A1A1D', legend: '#E8E4DC' },
      mod:    { base: '#0D0D10', legend: '#E8E4DC' },
      accent: { base: '#D4A547', legend: '#1A1A1D' },
      numpad: { base: '#1A1A1D', legend: '#E8E4DC' },
      space:  { base: '#0D0D10', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-bow',
    name: 'GMK BoW',
    description: 'Classic Black-on-White. The inverse of WoB — clean, professional, IBM Model M vibes.',
    credits: 'Designed by the community. Color codes: GMK N9 / GMK WS1 / accent GMK 2435.',
    colors: {
      alpha:  { base: '#E8E4DC', legend: '#1A1A1D' },
      mod:    { base: '#1A1A1D', legend: '#E8E4DC' },
      accent: { base: '#D4A547', legend: '#1A1A1D' },
      numpad: { base: '#E8E4DC', legend: '#1A1A1D' },
      space:  { base: '#1A1A1D', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-red-samurai',
    name: 'GMK Red Samurai',
    description: 'Crimson alphas with dark grey mods and gold accents. Japanese warrior aesthetic.',
    credits: 'Designed by Vicious. Color codes: GMK 7427 / GMK N9 / accent Pantone 871C.',
    colors: {
      alpha:  { base: '#8B1F1F', legend: '#E8E0CC' },
      mod:    { base: '#1F1F23', legend: '#E8E0CC' },
      accent: { base: '#D4A547', legend: '#1F1F23' },
      numpad: { base: '#8B1F1F', legend: '#E8E0CC' },
      space:  { base: '#1F1F23', legend: '#E8E0CC' },
    },
  },
  {
    id: 'gmk-bushido',
    name: 'GMK Bushido',
    description: 'Black alphas with red legends and white accents. Samurai code, distilled.',
    credits: 'Designed by Sylvain. Color codes: GMK N9 / GMK 7427 / accent GMK WS1.',
    colors: {
      alpha:  { base: '#1A1A1D', legend: '#C8302C' },
      mod:    { base: '#0D0D10', legend: '#E8E4DC' },
      accent: { base: '#E8E4DC', legend: '#1A1A1D' },
      numpad: { base: '#1A1A1D', legend: '#C8302C' },
      space:  { base: '#0D0D10', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-arcane',
    name: 'GMK Arcane',
    description: 'Deep navy alphas with arcane-gold legends. Magical, mystical, a touch occult.',
    credits: 'Designed by ALF. Color codes: GMK 5805 / Pantone 871C / accent Pantone 871C.',
    colors: {
      alpha:  { base: '#1E2A4A', legend: '#D4A547' },
      mod:    { base: '#0F1626', legend: '#D4A547' },
      accent: { base: '#8B1F1F', legend: '#D4A547' },
      numpad: { base: '#1E2A4A', legend: '#D4A547' },
      space:  { base: '#0F1626', legend: '#D4A547' },
    },
  },
  {
    id: 'gmk-arc',
    name: 'GMK Arc',
    description: 'Pastel mint alphas with lavender mods and peach accent. Soft, dreamy, ethereal.',
    credits: 'Designed by Cap. Color codes: GMK 5674 / GMK 5805 / accent Pantone 1625C.',
    colors: {
      alpha:  { base: '#B8D8C5', legend: '#3A3A3A' },
      mod:    { base: '#C8B8D8', legend: '#3A3A3A' },
      accent: { base: '#E8B4A0', legend: '#3A3A3A' },
      numpad: { base: '#B8D8C5', legend: '#3A3A3A' },
      space:  { base: '#C8B8D8', legend: '#3A3A3A' },
    },
  },
  {
    id: 'gmk-wasabi',
    name: 'GMK Wasabi',
    description: 'Soft green alphas with white legends and salmon accent. Fresh, culinary, Japanese.',
    credits: 'Designed by Pseudo. Color codes: GMK 5805 / WS1 / accent Pantone 170C.',
    colors: {
      alpha:  { base: '#7A9B76', legend: '#F5F2E8' },
      mod:    { base: '#5A7A56', legend: '#F5F2E8' },
      accent: { base: '#E88B7A', legend: '#3A3A3A' },
      numpad: { base: '#7A9B76', legend: '#F5F2E8' },
      space:  { base: '#5A7A56', legend: '#F5F2E8' },
    },
  },

  // ─── ePBT / PBTfans ────────────────────────────────────────────────────
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
    id: 'epbt-kobe',
    name: 'ePBT Kobe',
    description: 'Stone-grey alphas with red accents and cream legends. Japanese temple stone aesthetic.',
    credits: 'Designed by ck. Color codes: RAL 7038 / RAL 3028 / accent RAL 1013.',
    colors: {
      alpha:  { base: '#8C8B89', legend: '#1F1F23' },
      mod:    { base: '#5A5957', legend: '#E8E4DC' },
      accent: { base: '#9B2D2D', legend: '#E8E4DC' },
      numpad: { base: '#8C8B89', legend: '#1F1F23' },
      space:  { base: '#5A5957', legend: '#E8E4DC' },
    },
  },
  {
    id: 'pbtfans-mono',
    name: 'PBTfans Mono',
    description: 'High-contrast monochrome. Pure black alphas, white legends, clean and minimal.',
    credits: 'Designed by PBTfans. Color codes: RAL 9005 / RAL 9010.',
    colors: {
      alpha:  { base: '#0F0F12', legend: '#F5F2E8' },
      mod:    { base: '#1A1A1D', legend: '#F5F2E8' },
      accent: { base: '#D4A547', legend: '#0F0F12' },
      numpad: { base: '#0F0F12', legend: '#F5F2E8' },
      space:  { base: '#1A1A1D', legend: '#F5F2E8' },
    },
  },
  {
    id: 'pbtfans-wob',
    name: 'PBTfans WoB',
    description: 'Affordable White-on-Black alternative to GMK WoB. Same timeless look, half the price.',
    credits: 'Designed by PBTfans. Color codes: RAL 9010 / RAL 9005.',
    colors: {
      alpha:  { base: '#1A1A1D', legend: '#F0EDE5' },
      mod:    { base: '#0D0D10', legend: '#F0EDE5' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#1A1A1D', legend: '#F0EDE5' },
      space:  { base: '#0D0D10', legend: '#F0EDE5' },
    },
  },
  {
    id: 'epbt-void',
    name: 'ePBT Void',
    description: 'Deep void-blue alphas with light blue legends and white accent. Cosmic, dark, infinite.',
    credits: 'Designed by janglad. Color codes: RAL 5003 / RAL 6027 / accent RAL 9010.',
    colors: {
      alpha:  { base: '#1A2438', legend: '#8BA8C8' },
      mod:    { base: '#0D121F', legend: '#8BA8C8' },
      accent: { base: '#F5F2E8', legend: '#0D121F' },
      numpad: { base: '#1A2438', legend: '#8BA8C8' },
      space:  { base: '#0D121F', legend: '#8BA8C8' },
    },
  },
  {
    id: 'epbt-kayda',
    name: 'ePBT Kayda',
    description: 'Crimson alphas with cream legends and dark grey mods. Reborn from fire and ash.',
    credits: 'Designed by Obscure. Color codes: RAL 3020 / RAL 1015 / accent RAL 7016.',
    colors: {
      alpha:  { base: '#8B1F1F', legend: '#F0EDE5' },
      mod:    { base: '#3A3D44', legend: '#F0EDE5' },
      accent: { base: '#F0EDE5', legend: '#8B1F1F' },
      numpad: { base: '#8B1F1F', legend: '#F0EDE5' },
      space:  { base: '#3A3D44', legend: '#F0EDE5' },
    },
  },

  // ─── SP / Signature Plastics classics ──────────────────────────────────
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
    id: 'sp-honeywell',
    name: 'SP Honeywell',
    description: 'Atomic-era navy and honey-yellow. Inspired by 1960s Honeywell mainframe terminals.',
    credits: 'Designed by SP. Color codes: SP TBN / SP WFK / accent SP YYR.',
    colors: {
      alpha:  { base: '#1A2438', legend: '#E8C36B' },
      mod:    { base: '#0F1626', legend: '#E8C36B' },
      accent: { base: '#E8C36B', legend: '#1A2438' },
      numpad: { base: '#1A2438', legend: '#E8C36B' },
      space:  { base: '#0F1626', legend: '#E8C36B' },
    },
  },
  {
    id: 'sp-calm-depths',
    name: 'SP Calm Depths',
    description: 'Deep teal alphas with sky-blue mods and cream accents. Oceanic, serene, meditative.',
    credits: 'Designed by bipolar. Color codes: SP TBN / SP BBT / accent SP WFK.',
    colors: {
      alpha:  { base: '#1F4847', legend: '#E8E4DC' },
      mod:    { base: '#5A8FA8', legend: '#FFFFFF' },
      accent: { base: '#F5F2E8', legend: '#1F4847' },
      numpad: { base: '#1F4847', legend: '#E8E4DC' },
      space:  { base: '#5A8FA8', legend: '#FFFFFF' },
    },
  },
  {
    id: 'sp-1976',
    name: 'SP 1976',
    description: 'Retro computer beige with multicolor accent keys. A love letter to the Apple II era.',
    credits: 'Designed by mpg. Color codes: SP WFK / SP VBC / multi-color accents.',
    colors: {
      alpha:  { base: '#D8C9A0', legend: '#2D2D2D' },
      mod:    { base: '#A88D5A', legend: '#F5F2E8' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#D8C9A0', legend: '#2D2D2D' },
      space:  { base: '#A88D5A', legend: '#F5F2E8' },
    },
  },

  // ─── Modern / Theme-based ──────────────────────────────────────────────
  {
    id: 'gmk-kingfisher',
    name: 'GMK Kingfisher',
    description: 'Vivid orange alphas with teal accents and dark grey mods. The kingfisher bird in keyboard form.',
    credits: 'Designed by oblivious. Color codes: GMK 7401 / GMK 5805 / accent Pantone 3272C.',
    colors: {
      alpha:  { base: '#E85D2C', legend: '#FDF6E3' },
      mod:    { base: '#1A1A1D', legend: '#FDF6E3' },
      accent: { base: '#2A9D8F', legend: '#FDF6E3' },
      numpad: { base: '#E85D2C', legend: '#FDF6E3' },
      space:  { base: '#1A1A1D', legend: '#FDF6E3' },
    },
  },
  {
    id: 'gmk-sky-dolch',
    name: 'GMK Sky Dolch',
    description: 'Sky-blue version of the legendary Dolch. Light blue alphas with white legends.',
    credits: 'Designed by Taeyoung Kim. Color codes: GMK 9418 / GMK WS1 / accent GMK 2435.',
    colors: {
      alpha:  { base: '#5A8AB5', legend: '#F5F8FC' },
      mod:    { base: '#2D4A6B', legend: '#F5F8FC' },
      accent: { base: '#D4A547', legend: '#2D4A6B' },
      numpad: { base: '#5A8AB5', legend: '#F5F8FC' },
      space:  { base: '#2D4A6B', legend: '#F5F8FC' },
    },
  },
  {
    id: 'gmk-stripes',
    name: 'GMK Stripes',
    description: 'Striped pattern in pastel pink, blue and yellow. Playful, summery, ice-cream parlor vibes.',
    credits: 'Designed by Cap. Color codes: GMK 5250 / 5805 / 5674 / WS1.',
    colors: {
      alpha:  { base: '#F5D7D0', legend: '#3A3A3A' },
      mod:    { base: '#B8D8C5', legend: '#3A3A3A' },
      accent: { base: '#E8C36B', legend: '#3A3A3A' },
      numpad: { base: '#F5D7D0', legend: '#3A3A3A' },
      space:  { base: '#B8D8C5', legend: '#3A3A3A' },
    },
  },
  {
    id: 'gmk-70s',
    name: 'GMK 70s',
    description: 'Retro 1970s palette: mustard yellow, burnt orange, avocado green, harvest gold.',
    credits: 'Designed by Lightning. Color codes: Pantone 7405C / 7550C / 7401C / 4665C.',
    colors: {
      alpha:  { base: '#D4A547', legend: '#3A2818' },
      mod:    { base: '#7A4A2B', legend: '#F5E6C8' },
      accent: { base: '#5A6A4F', legend: '#F5E6C8' },
      numpad: { base: '#D4A547', legend: '#3A2818' },
      space:  { base: '#7A4A2B', legend: '#F5E6C8' },
    },
  },
  {
    id: 'gmk-hospital',
    name: 'GMK Hospital',
    description: 'Clinical white alphas with mint-green mods and red emergency accents. Sterile, clean, faintly ominous.',
    credits: 'Designed by Saint. Color codes: GMK WS1 / 5674 / accent Pantone 485C.',
    colors: {
      alpha:  { base: '#F5F5F0', legend: '#1F1F23' },
      mod:    { base: '#A8D5BA', legend: '#1F1F23' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#F5F5F0', legend: '#1F1F23' },
      space:  { base: '#A8D5BA', legend: '#1F1F23' },
    },
  },
  {
    id: 'gmk-yuri',
    name: 'GMK Yuri',
    description: 'Soviet-space-race red and grey with star-white accents. Cosmic propaganda aesthetic.',
    credits: 'Designed by Lightning. Color codes: GMK 7427 / GMK N9 / accent GMK WS1.',
    colors: {
      alpha:  { base: '#8B1F1F', legend: '#E8E4DC' },
      mod:    { base: '#3A3D44', legend: '#E8E4DC' },
      accent: { base: '#F5F2E8', legend: '#8B1F1F' },
      numpad: { base: '#8B1F1F', legend: '#E8E4DC' },
      space:  { base: '#3A3D44', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-huadiao',
    name: 'GMK Huadiao',
    description: 'Chinese flower-carving inspired: pale jade alphas with crimson accents and dark grey mods.',
    credits: 'Designed by bOoGIE. Color codes: GMK 5805 / GMK 7427 / accent Pantone 7427C.',
    colors: {
      alpha:  { base: '#A8C5A0', legend: '#2D2545' },
      mod:    { base: '#2D2545', legend: '#A8C5A0' },
      accent: { base: '#9B2D2D', legend: '#F5F2E8' },
      numpad: { base: '#A8C5A0', legend: '#2D2545' },
      space:  { base: '#2D2545', legend: '#A8C5A0' },
    },
  },
  {
    id: 'gmk-modern-moscow',
    name: 'GMK Modern Moscow',
    description: 'Constructivist red, black and ivory. Soviet propaganda poster meets modern keycap.',
    credits: 'Designed by ilgooz. Color codes: GMK 7427 / GMK N9 / accent GMK WS1.',
    colors: {
      alpha:  { base: '#E8E4DC', legend: '#8B1F1F' },
      mod:    { base: '#1A1A1D', legend: '#E8E4DC' },
      accent: { base: '#8B1F1F', legend: '#E8E4DC' },
      numpad: { base: '#E8E4DC', legend: '#8B1F1F' },
      space:  { base: '#1A1A1D', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-paperwork',
    name: 'GMK Paperwork',
    description: 'Office-paper white alphas with manila-folder tan mods and red stapler accent.',
    credits: 'Designed by Lightning. Color codes: GMK WS1 / 7233 / accent Pantone 485C.',
    colors: {
      alpha:  { base: '#F5F2E8', legend: '#3A3A3A' },
      mod:    { base: '#D4B886', legend: '#3A3A3A' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#F5F2E8', legend: '#3A3A3A' },
      space:  { base: '#D4B886', legend: '#3A3A3A' },
    },
  },
  {
    id: 'gmk-phantom',
    name: 'GMK Phantom',
    description: 'Ghostly pale-blue alphas with white legends and dark navy accents. Spectral, ethereal.',
    credits: 'Designed by Glenn. Color codes: GMK 9418 / WS1 / accent GMK 5805.',
    colors: {
      alpha:  { base: '#C8D5DC', legend: '#1A2438' },
      mod:    { base: '#E8E4DC', legend: '#1A2438' },
      accent: { base: '#1A2438', legend: '#C8D5DC' },
      numpad: { base: '#C8D5DC', legend: '#1A2438' },
      space:  { base: '#E8E4DC', legend: '#1A2438' },
    },
  },
  {
    id: 'gmk-lavender',
    name: 'GMK Lavender',
    description: 'Soft purple alphas with cream legends and sage-green accents. Calming, herbal, summery.',
    credits: 'Designed by rkg. Color codes: GMK 6635 / WS1 / accent Pantone 5535C.',
    colors: {
      alpha:  { base: '#A88EC8', legend: '#FDF6E3' },
      mod:    { base: '#7A6B9B', legend: '#FDF6E3' },
      accent: { base: '#7A9B76', legend: '#FDF6E3' },
      numpad: { base: '#A88EC8', legend: '#FDF6E3' },
      space:  { base: '#7A6B9B', legend: '#FDF6E3' },
    },
  },
  {
    id: 'gmk-caramel',
    name: 'GMK Caramel',
    description: 'Warm caramel alphas with chocolate-brown mods and sea-salt cream accents. Dessert for your desk.',
    credits: 'Designed by Pseudo. Color codes: GMK 7233 / 7299 / accent GMK WS1.',
    colors: {
      alpha:  { base: '#C8945A', legend: '#3A2818' },
      mod:    { base: '#4A3020', legend: '#E8DEC2' },
      accent: { base: '#F5E6C8', legend: '#4A3020' },
      numpad: { base: '#C8945A', legend: '#3A2818' },
      space:  { base: '#4A3020', legend: '#E8DEC2' },
    },
  },
  {
    id: 'gmk-camping',
    name: 'GMK Camping',
    description: 'Forest-green alphas with khaki mods and campfire-orange accents. Great outdoors on your desk.',
    credits: 'Designed by Harbor. Color codes: GMK 5805 / 7233 / accent Pantone 1505C.',
    colors: {
      alpha:  { base: '#2D4A3E', legend: '#E8E4DC' },
      mod:    { base: '#A88D5A', legend: '#2D2545' },
      accent: { base: '#E85D2C', legend: '#FFFFFF' },
      numpad: { base: '#2D4A3E', legend: '#E8E4DC' },
      space:  { base: '#A88D5A', legend: '#2D2545' },
    },
  },
  {
    id: 'gmk-deep-navy',
    name: 'GMK Deep Navy',
    description: 'Pure deep navy with crisp white legends. Nautical, professional, infinitely versatile.',
    credits: 'Designed by js. Color codes: GMK 5805 / WS1 / accent Pantone 186C.',
    colors: {
      alpha:  { base: '#0F1E3A', legend: '#E8E4DC' },
      mod:    { base: '#1E3A5F', legend: '#E8E4DC' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#0F1E3A', legend: '#E8E4DC' },
      space:  { base: '#1E3A5F', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-olm',
    name: 'GMK Olm',
    description: 'Cave-dwelling salamander palette: pale pink alphas with dark grey mods and accent yellow.',
    credits: 'Designed by Oblivious. Color codes: GMK 5250 / GMK N9 / accent Pantone 109C.',
    colors: {
      alpha:  { base: '#E8C8C0', legend: '#3A3A3A' },
      mod:    { base: '#2D2D32', legend: '#E8E4DC' },
      accent: { base: '#E8C36B', legend: '#2D2D32' },
      numpad: { base: '#E8C8C0', legend: '#3A3A3A' },
      space:  { base: '#2D2D32', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-metaverse',
    name: 'GMK Metaverse',
    description: 'Cyberpunk neon: dark base with electric cyan legends and magenta accents. Ready Player One vibes.',
    credits: 'Designed by Alf. Color codes: GMK N9 / 5805 / accent Pantone 806C.',
    colors: {
      alpha:  { base: '#1A1A2E', legend: '#00D9FF' },
      mod:    { base: '#0D0D1A', legend: '#00D9FF' },
      accent: { base: '#FF1B6B', legend: '#0D0D1A' },
      numpad: { base: '#1A1A2E', legend: '#00D9FF' },
      space:  { base: '#0D0D1A', legend: '#00D9FF' },
    },
  },
  {
    id: 'gmk-orient',
    name: 'GMK Orient',
    description: 'Jade-green alphas with ivory mods and crimson accent. East Asian temple aesthetic.',
    credits: 'Designed by Jeff. Color codes: GMK 5805 / WS1 / accent Pantone 7427C.',
    colors: {
      alpha:  { base: '#3A6A4F', legend: '#F5F2E8' },
      mod:    { base: '#F0EDE5', legend: '#3A6A4F' },
      accent: { base: '#9B2D2D', legend: '#F5F2E8' },
      numpad: { base: '#3A6A4F', legend: '#F5F2E8' },
      space:  { base: '#F0EDE5', legend: '#3A6A4F' },
    },
  },

  // ─── KeyKobo (KK) ───────────────────────────────────────────────────────
  {
    id: 'kk-blue-plum',
    name: 'KeyKobo Blue Plum',
    description: 'PBT dye-sub with deep blue-grey alphas, plum-purple mods and pink accent. Soft, hazy, dreamlike.',
    credits: 'Designed by KeyKobo. PBT dye-sublimated, Cherry profile.',
    colors: {
      alpha:  { base: '#4A5D7A', legend: '#E8E0F0' },
      mod:    { base: '#6A4870', legend: '#E8E0F0' },
      accent: { base: '#E8A8B8', legend: '#4A5D7A' },
      numpad: { base: '#4A5D7A', legend: '#E8E0F0' },
      space:  { base: '#6A4870', legend: '#E8E0F0' },
    },
  },
  {
    id: 'kk-honey-milk',
    name: 'KeyKobo Honey Milk',
    description: 'Warm cream alphas with honey-gold mods and cocoa-brown accent. Comforting, dessert-like, sweet.',
    credits: 'Designed by KeyKobo. PBT dye-sublimated, Cherry profile.',
    colors: {
      alpha:  { base: '#F5E6C8', legend: '#4A3020' },
      mod:    { base: '#D4A547', legend: '#3A2818' },
      accent: { base: '#5C3A1F', legend: '#F5E6C8' },
      numpad: { base: '#F5E6C8', legend: '#4A3020' },
      space:  { base: '#D4A547', legend: '#3A2818' },
    },
  },
  {
    id: 'kk-moon-dust',
    name: 'KeyKobo Moon Dust',
    description: 'Pale lunar grey alphas with deeper grey mods and rust-red accent. Apollo-era industrial aesthetic.',
    credits: 'Designed by KeyKobo. PBT dye-sublimated, Cherry profile.',
    colors: {
      alpha:  { base: '#B8B5AC', legend: '#3A3730' },
      mod:    { base: '#5A5750', legend: '#E8E4DC' },
      accent: { base: '#9B3A2A', legend: '#F5F2E8' },
      numpad: { base: '#B8B5AC', legend: '#3A3730' },
      space:  { base: '#5A5750', legend: '#E8E4DC' },
    },
  },
  {
    id: 'kk-botanical-80s',
    name: 'KeyKobo Botanical 80s',
    description: 'Retro-80s reimagining of Botanical: muted sage alphas, dusty rose mods, terracotta accent.',
    credits: 'Designed by KeyKobo. PBT dye-sub, retro color reinterpretation.',
    colors: {
      alpha:  { base: '#7A8A6B', legend: '#F5E8D5' },
      mod:    { base: '#C89B8B', legend: '#3A2818' },
      accent: { base: '#A85A3A', legend: '#F5E8D5' },
      numpad: { base: '#7A8A6B', legend: '#F5E8D5' },
      space:  { base: '#C89B8B', legend: '#3A2818' },
    },
  },
  {
    id: 'kk-iron-ore',
    name: 'KeyKobo Iron Ore',
    description: 'Industrial iron alphas with rust-orange mods and steel-grey accents. Heavy-machinery aesthetic.',
    credits: 'Designed by KeyKobo. PBT dye-sub, industrial-inspired palette.',
    colors: {
      alpha:  { base: '#3D3A35', legend: '#C8B898' },
      mod:    { base: '#8B4513', legend: '#F5E6C8' },
      accent: { base: '#A8A8A0', legend: '#3D3A35' },
      numpad: { base: '#3D3A35', legend: '#C8B898' },
      space:  { base: '#8B4513', legend: '#F5E6C8' },
    },
  },
  {
    id: 'kk-peaches-cream',
    name: 'KeyKobo Peaches & Cream',
    description: 'Soft peach alphas with cream mods and sage-green accent. Afternoon-tea softness.',
    credits: 'Designed by KeyKobo. PBT dye-sub, pastel palette.',
    colors: {
      alpha:  { base: '#F5C8B0', legend: '#5C3A2A' },
      mod:    { base: '#FDF6E3', legend: '#5C3A2A' },
      accent: { base: '#8BA888', legend: '#FDF6E3' },
      numpad: { base: '#F5C8B0', legend: '#5C3A2A' },
      space:  { base: '#FDF6E3', legend: '#5C3A2A' },
    },
  },
  {
    id: 'kk-matcha-milk',
    name: 'KeyKobo Matcha Milk',
    description: 'Stone-ground matcha green alphas with milk-white mods and red-bean accent. Japanese tea ceremony palette.',
    credits: 'Designed by KeyKobo. PBT dye-sub, wagashi-inspired.',
    colors: {
      alpha:  { base: '#7A9159', legend: '#F5F2E8' },
      mod:    { base: '#F5EFE0', legend: '#5C4A3A' },
      accent: { base: '#8B2D2D', legend: '#F5EFE0' },
      numpad: { base: '#7A9159', legend: '#F5F2E8' },
      space:  { base: '#F5EFE0', legend: '#5C4A3A' },
    },
  },
  {
    id: 'kk-dark-magenta',
    name: 'KeyKobo Dark Magenta',
    description: 'Deep magenta alphas with charcoal mods and pink accent. Jewel-toned, regal, evening wear.',
    credits: 'Designed by KeyKobo. PBT dye-sub, dark-jewel palette.',
    colors: {
      alpha:  { base: '#5C2A5C', legend: '#F0C8E0' },
      mod:    { base: '#1F1F23', legend: '#F0C8E0' },
      accent: { base: '#FF6BA8', legend: '#1F1F23' },
      numpad: { base: '#5C2A5C', legend: '#F0C8E0' },
      space:  { base: '#1F1F23', legend: '#F0C8E0' },
    },
  },

  // ─── Domikey (Dom) ──────────────────────────────────────────────────────
  {
    id: 'dom-jojo',
    name: 'Domikey JoJo',
    description: 'JJBA-inspired: vibrant gold alphas with green mods and red accent. Stand-user aesthetic.',
    credits: 'Designed by Domikey. PBT dye-sub, Cherry profile, anime-themed.',
    colors: {
      alpha:  { base: '#E8C36B', legend: '#3A2A0D' },
      mod:    { base: '#3A6A4F', legend: '#F5F2E8' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#E8C36B', legend: '#3A2A0D' },
      space:  { base: '#3A6A4F', legend: '#F5F2E8' },
    },
  },
  {
    id: 'dom-berserk',
    name: 'Domikey Berserk',
    description: 'Dark fantasy: black alphas with blood-red legends and silver accents. Guts-inspired brutal aesthetic.',
    credits: 'Designed by Domikey. PBT dye-sub, anime dark-fantasy palette.',
    colors: {
      alpha:  { base: '#1A1A1D', legend: '#8B1F1F' },
      mod:    { base: '#0D0D10', legend: '#8B1F1F' },
      accent: { base: '#C8C8C8', legend: '#1A1A1D' },
      numpad: { base: '#1A1A1D', legend: '#8B1F1F' },
      space:  { base: '#0D0D10', legend: '#8B1F1F' },
    },
  },
  {
    id: 'dom-ascii',
    name: 'Domikey ASCII',
    description: 'Cyberpunk terminal: black alphas with bright-green CRT legends. The Matrix and Tron vibes.',
    credits: 'Designed by Domikey. PBT dye-sub, terminal-green palette.',
    colors: {
      alpha:  { base: '#0A0A0A', legend: '#00FF66' },
      mod:    { base: '#1A1A1A', legend: '#00FF66' },
      accent: { base: '#00FF66', legend: '#0A0A0A' },
      numpad: { base: '#0A0A0A', legend: '#00FF66' },
      space:  { base: '#1A1A1A', legend: '#00FF66' },
    },
  },

  // ─── Akko (AK) ──────────────────────────────────────────────────────────
  {
    id: 'ak-rose-gold',
    name: 'Akko Rose Gold',
    description: 'Pink-tinged rose-gold alphas with cream legends and brown mods. Affordable luxury aesthetic.',
    credits: 'Designed by Akko. PBT dye-sub, Cherry profile, value-tier.',
    colors: {
      alpha:  { base: '#E8B4A8', legend: '#5C3A3A' },
      mod:    { base: '#5C3A3A', legend: '#F5E6E0' },
      accent: { base: '#D4A547', legend: '#5C3A3A' },
      numpad: { base: '#E8B4A8', legend: '#5C3A3A' },
      space:  { base: '#5C3A3A', legend: '#F5E6E0' },
    },
  },
  {
    id: 'ak-black-gold',
    name: 'Akko Black & Gold',
    description: 'Stealthy black alphas with gold legends. Affordable alternative to GMK Noir / Mecha-01.',
    credits: 'Designed by Akko. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#1A1A1D', legend: '#D4A547' },
      mod:    { base: '#0D0D10', legend: '#D4A547' },
      accent: { base: '#D4A547', legend: '#1A1A1D' },
      numpad: { base: '#1A1A1D', legend: '#D4A547' },
      space:  { base: '#0D0D10', legend: '#D4A547' },
    },
  },
  {
    id: 'ak-ocean-star',
    name: 'Akko Ocean Star',
    description: 'Bright ocean-blue alphas with white legends and yellow accent. Summer beach vibes.',
    credits: 'Designed by Akko. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#1E8AB5', legend: '#F5F8FC' },
      mod:    { base: '#F0EDE5', legend: '#1E8AB5' },
      accent: { base: '#FFD23F', legend: '#1E3A5F' },
      numpad: { base: '#1E8AB5', legend: '#F5F8FC' },
      space:  { base: '#F0EDE5', legend: '#1E8AB5' },
    },
  },
  {
    id: 'ak-mecha-orange',
    name: 'Akko Mecha Orange',
    description: 'Industrial orange alphas with dark grey mods. Construction-equipment aesthetic, affordable.',
    credits: 'Designed by Akko. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#E85D2C', legend: '#1F1F23' },
      mod:    { base: '#3A3D44', legend: '#E85D2C' },
      accent: { base: '#F5F2E8', legend: '#1F1F23' },
      numpad: { base: '#E85D2C', legend: '#1F1F23' },
      space:  { base: '#3A3D44', legend: '#E85D2C' },
    },
  },

  // ─── JTK (JT) ───────────────────────────────────────────────────────────
  {
    id: 'jt-cha-cha',
    name: 'JTK Charcoal',
    description: 'Charcoal-grey alphas with off-white legends. Affordable alternative to GMK Dolch / GMK Noir.',
    credits: 'Designed by JTK. ABS double-shot, Cherry profile.',
    colors: {
      alpha:  { base: '#2D2D30', legend: '#C8CDD2' },
      mod:    { base: '#1A1A1D', legend: '#C8CDD2' },
      accent: { base: '#8B1F1F', legend: '#E8E4DC' },
      numpad: { base: '#2D2D30', legend: '#C8CDD2' },
      space:  { base: '#1A1A1D', legend: '#C8CDD2' },
    },
  },
  {
    id: 'jt-cream-cheese',
    name: 'JTK Cream Cheese',
    description: 'Cream alphas with pinkish-red mods and accent. Soft, bakery-fresh palette.',
    credits: 'Designed by JTK. ABS double-shot, Cherry profile.',
    colors: {
      alpha:  { base: '#F5E8D5', legend: '#5C3A3A' },
      mod:    { base: '#E89090', legend: '#FFFFFF' },
      accent: { base: '#9B2D2D', legend: '#F5E8D5' },
      numpad: { base: '#F5E8D5', legend: '#5C3A3A' },
      space:  { base: '#E89090', legend: '#FFFFFF' },
    },
  },
  {
    id: 'jt-koala',
    name: 'JTK Koala',
    description: 'Eucalyptus-green alphas with grey mods and cream accent. Koala-in-the-wild palette.',
    credits: 'Designed by JTK. ABS double-shot, Cherry profile.',
    colors: {
      alpha:  { base: '#6B8A5F', legend: '#F5F2E8' },
      mod:    { base: '#5A5A5A', legend: '#F5F2E8' },
      accent: { base: '#F5E6C8', legend: '#5A5A5A' },
      numpad: { base: '#6B8A5F', legend: '#F5F2E8' },
      space:  { base: '#5A5A5A', legend: '#F5F2E8' },
    },
  },

  // ─── MiBo (MB) ──────────────────────────────────────────────────────────
  {
    id: 'mb-manchurian',
    name: 'MiBo Manchurian',
    description: 'Pale yellow alphas with deep purple mods and orange accent. Autumn palace aesthetic.',
    credits: 'Designed by MiBo. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#E8D060', legend: '#3A2818' },
      mod:    { base: '#3D2A5C', legend: '#E8D060' },
      accent: { base: '#D4654B', legend: '#FFFFFF' },
      numpad: { base: '#E8D060', legend: '#3A2818' },
      space:  { base: '#3D2A5C', legend: '#E8D060' },
    },
  },
  {
    id: 'mb-driftwood',
    name: 'MiBo Driftwood',
    description: 'Sun-bleached driftwood grey with seafoam-green accent. Beachcomber palette.',
    credits: 'Designed by MiBo. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#A8A090', legend: '#3A3730' },
      mod:    { base: '#6A6258', legend: '#F5F2E8' },
      accent: { base: '#7BBDA8', legend: '#3A3730' },
      numpad: { base: '#A8A090', legend: '#3A3730' },
      space:  { base: '#6A6258', legend: '#F5F2E8' },
    },
  },

  // ─── Cherry (original / GMK-rendered classics) ──────────────────────────
  {
    id: 'cherry-g81-dolch',
    name: 'Cherry G81 Dolch',
    description: 'The original Dolch PAC keyboard. Charcoal alphas with light-grey legends — the OG that started it all.',
    credits: 'Original equipment on Dolch PAC computer keyboards. Cherry G81 PBT, GMK reproductions exist.',
    colors: {
      alpha:  { base: '#3A3D44', legend: '#C8CDD2' },
      mod:    { base: '#25272B', legend: '#C8CDD2' },
      accent: { base: '#8B1F1F', legend: '#E8E4DC' },
      numpad: { base: '#3A3D44', legend: '#C8CDD2' },
      space:  { base: '#25272B', legend: '#C8CDD2' },
    },
  },
  {
    id: 'cherry-g80-wob',
    name: 'Cherry G80 WoB',
    description: 'Original Cherry Corp black-on-white. The set every keyboard enthusiast has owned at some point.',
    credits: 'Cherry Corp G80-3000 stock keycaps. ABS double-shot, Cherry profile.',
    colors: {
      alpha:  { base: '#E8E4DC', legend: '#1A1A1D' },
      mod:    { base: '#1A1A1D', legend: '#E8E4DC' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#E8E4DC', legend: '#1A1A1D' },
      space:  { base: '#1A1A1D', legend: '#E8E4DC' },
    },
  },

  // ─── NovelKeys / NK_ ────────────────────────────────────────────────────
  {
    id: 'nk-tokyo-night',
    name: 'Tokyo Night',
    description: 'VSCode-inspired: deep night-blue alphas with neon pink/cyan legends. Synthwave Tokyo at midnight.',
    credits: 'Inspired by enkia VSCode theme. Various PBT dye-sub manufacturers.',
    colors: {
      alpha:  { base: '#1A1B26', legend: '#7AA2F7' },
      mod:    { base: '#16161E', legend: '#BB9AF7' },
      accent: { base: '#F7768E', legend: '#1A1B26' },
      numpad: { base: '#1A1B26', legend: '#7AA2F7' },
      space:  { base: '#16161E', legend: '#BB9AF7' },
    },
  },
  {
    id: 'nk-gruvbox',
    name: 'Gruvbox',
    description: 'Retro-groove palette: warm cream alphas with brown mods and orange accent. Vim-themed.',
    credits: 'Inspired by morhetz Gruvbox color scheme. Various PBT dye-sub manufacturers.',
    colors: {
      alpha:  { base: '#FBF1C7', legend: '#3C3836' },
      mod:    { base: '#504945', legend: '#EBDBB2' },
      accent: { base: '#FE8019', legend: '#1A1A1A' },
      numpad: { base: '#FBF1C7', legend: '#3C3836' },
      space:  { base: '#504945', legend: '#EBDBB2' },
    },
  },
  {
    id: 'nk-nord',
    name: 'Nord',
    description: 'Arctic palette: glacier-blue alphas with deep slate mods and frost-white accent. Cold, crisp, clean.',
    credits: 'Inspired by arcticicestudio Nord color scheme. Various PBT dye-sub manufacturers.',
    colors: {
      alpha:  { base: '#5E81AC', legend: '#ECEFF4' },
      mod:    { base: '#2E3440', legend: '#D8DEE9' },
      accent: { base: '#88C0D0', legend: '#2E3440' },
      numpad: { base: '#5E81AC', legend: '#ECEFF4' },
      space:  { base: '#2E3440', legend: '#D8DEE9' },
    },
  },
  {
    id: 'nk-catppuccin',
    name: 'Catppuccin Mocha',
    description: 'Soft pastel palette: dark base with pink, mauve, and cyan accents. Soothing low-contrast aesthetic.',
    credits: 'Inspired by Catppuccin color palette. Various PBT dye-sub manufacturers.',
    colors: {
      alpha:  { base: '#1E1E2E', legend: '#CBA6F7' },
      mod:    { base: '#181825', legend: '#F5C2E7' },
      accent: { base: '#F5C2E7', legend: '#1E1E2E' },
      numpad: { base: '#1E1E2E', legend: '#CBA6F7' },
      space:  { base: '#181825', legend: '#F5C2E7' },
    },
  },
  {
    id: 'nk-rose-pine',
    name: 'Rosé Pine',
    description: 'Rosé-tinted dusk palette: muted alphas with rose-gold and pine accents. Soho sophistication.',
    credits: 'Inspired by Rosé Pine color scheme. Various PBT dye-sub manufacturers.',
    colors: {
      alpha:  { base: '#1F1D2E', legend: '#E0DEF4' },
      mod:    { base: '#191724', legend: '#EBBCBA' },
      accent: { base: '#EBBCBA', legend: '#191724' },
      numpad: { base: '#1F1D2E', legend: '#E0DEF4' },
      space:  { base: '#191724', legend: '#EBBCBA' },
    },
  },

  // ─── GMK additional classics ───────────────────────────────────────────
  {
    id: 'gmk-mizu',
    name: 'GMK Mizu',
    description: 'Water-inspired: soft blue alphas with cyan accents and white legends. Cool and refreshing.',
    credits: 'Designed by Rensuya. Color codes: GMK 9418 / WS1 / accent Pantone 319C.',
    colors: {
      alpha:  { base: '#6BA3C8', legend: '#F5F8FC' },
      mod:    { base: '#2D5F8A', legend: '#F5F8FC' },
      accent: { base: '#5BC0BE', legend: '#1A1A1A' },
      numpad: { base: '#6BA3C8', legend: '#F5F8FC' },
      space:  { base: '#2D5F8A', legend: '#F5F8FC' },
    },
  },
  {
    id: 'gmk-striker',
    name: 'GMK Striker',
    description: 'Soccer-inspired: white alphas with black mods and bright accent yellow. Sporty, energetic.',
    credits: 'Designed by Xen. Color codes: GMK WS1 / N9 / accent Pantone 109C.',
    colors: {
      alpha:  { base: '#F5F2E8', legend: '#1A1A1D' },
      mod:    { base: '#1A1A1D', legend: '#F5F2E8' },
      accent: { base: '#FFD23F', legend: '#1A1A1D' },
      numpad: { base: '#F5F2E8', legend: '#1A1A1D' },
      space:  { base: '#1A1A1D', legend: '#F5F2E8' },
    },
  },
  {
    id: 'gmk-led-80s',
    name: 'GMK LED 80s',
    description: 'Retro 80s palette with neon green, hot pink, electric blue. Synthwave dream.',
    credits: 'Designed by Lightning. Color codes: Pantone 802C / 806C / 2728C.',
    colors: {
      alpha:  { base: '#1A0D2E', legend: '#39FF14' },
      mod:    { base: '#0D0820', legend: '#FF10F0' },
      accent: { base: '#FF10F0', legend: '#1A0D2E' },
      numpad: { base: '#1A0D2E', legend: '#39FF14' },
      space:  { base: '#0D0820', legend: '#FF10F0' },
    },
  },
  {
    id: 'gmk-thropolis',
    name: 'GMK Thropolis',
    description: 'Sandstone alphas with teal mods and terracotta accent. Ancient-civilization vibe.',
    credits: 'Designed by p thermo. Color codes: Pantone 7527C / 3195C / accent 7577C.',
    colors: {
      alpha:  { base: '#D4B894', legend: '#3A2818' },
      mod:    { base: '#3A8A8C', legend: '#F5E6C8' },
      accent: { base: '#A8551F', legend: '#F5E6C8' },
      numpad: { base: '#D4B894', legend: '#3A2818' },
      space:  { base: '#3A8A8C', legend: '#F5E6C8' },
    },
  },
  {
    id: 'gmk-wilden',
    name: 'GMK Wilden',
    description: 'Forest dark green alphas with autumn orange mods and cream accents. Wilderness aesthetic.',
    credits: 'Designed by PLastic. Color codes: GMK 5805 / 7401 / accent WS1.',
    colors: {
      alpha:  { base: '#1F3D2B', legend: '#F5E6C8' },
      mod:    { base: '#C8651F', legend: '#FFFFFF' },
      accent: { base: '#F5E6C8', legend: '#1F3D2B' },
      numpad: { base: '#1F3D2B', legend: '#F5E6C8' },
      space:  { base: '#C8651F', legend: '#FFFFFF' },
    },
  },
  {
    id: 'gmk-violet-tendencies',
    name: 'GMK Violet Tendencies',
    description: 'Royal violet alphas with cream legends and gold accents. Elegant, regal, evening wear.',
    credits: 'Designed by Illusion. Color codes: Pantone 2685C / 7527C / accent 871C.',
    colors: {
      alpha:  { base: '#3F2A5C', legend: '#E8E0CC' },
      mod:    { base: '#2D1A40', legend: '#E8E0CC' },
      accent: { base: '#D4A547', legend: '#2D1A40' },
      numpad: { base: '#3F2A5C', legend: '#E8E0CC' },
      space:  { base: '#2D1A40', legend: '#E8E0CC' },
    },
  },
  {
    id: 'gmk-vertex',
    name: 'GMK Vertex',
    description: 'Geometric: light grey alphas with dark navy mods and cyan accent. Modernist architecture.',
    credits: 'Designed by Owen. Color codes: Pantone 7541C / 5395C / accent 3195C.',
    colors: {
      alpha:  { base: '#D4D8DC', legend: '#1F2A3A' },
      mod:    { base: '#1F2A3A', legend: '#D4D8DC' },
      accent: { base: '#5BC0BE', legend: '#1F2A3A' },
      numpad: { base: '#D4D8DC', legend: '#1F2A3A' },
      space:  { base: '#1F2A3A', legend: '#D4D8DC' },
    },
  },
  {
    id: 'gmk-olivia-monochrome',
    name: 'GMK Olivia Monochrome',
    description: 'Pure monochrome version of Olivia: greyscale alphas with peach accent only.',
    credits: 'Designed by Olivia. Color codes: GMK U9 / N9 / accent Pantone 1625C.',
    colors: {
      alpha:  { base: '#7A7A7A', legend: '#E8E4DC' },
      mod:    { base: '#3A3A3A', legend: '#E8E4DC' },
      accent: { base: '#E8B4A0', legend: '#3A3A3A' },
      numpad: { base: '#7A7A7A', legend: '#E8E4DC' },
      space:  { base: '#3A3A3A', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-jamon',
    name: 'GMK Jamón',
    description: 'Ham-pink alphas with red mods and cream accents. Spanish-cured-meat whimsy.',
    credits: 'Designed by Pellet. Color codes: Pantone 2035C / 7626C / accent 7401C.',
    colors: {
      alpha:  { base: '#E88B8B', legend: '#FFFFFF' },
      mod:    { base: '#8B1F1F', legend: '#F5E6C8' },
      accent: { base: '#F5E6C8', legend: '#8B1F1F' },
      numpad: { base: '#E88B8B', legend: '#FFFFFF' },
      space:  { base: '#8B1F1F', legend: '#F5E6C8' },
    },
  },
  {
    id: 'gmk-bone',
    name: 'GMK Bone',
    description: 'Warm bone-cream alphas with darker bone mods and accent red. Vintage typewriter feel.',
    credits: 'Designed by doubly. Color codes: Pantone 7527C / 7522C / accent 7427C.',
    colors: {
      alpha:  { base: '#E8DEC8', legend: '#3A2818' },
      mod:    { base: '#A89878', legend: '#F5EDD8' },
      accent: { base: '#8B1F1F', legend: '#F5EDD8' },
      numpad: { base: '#E8DEC8', legend: '#3A2818' },
      space:  { base: '#A89878', legend: '#F5EDD8' },
    },
  },
  {
    id: 'gmk-wob-laser',
    name: 'GMK WoB Laser',
    description: 'Black-on-white with laser-bright accents. Crisp, modern, sharp.',
    credits: 'Designed by Zambumon. Color codes: GMK WS1 / N9 / accent Pantone 806C.',
    colors: {
      alpha:  { base: '#F5F2E8', legend: '#1A1A1D' },
      mod:    { base: '#1A1A1D', legend: '#F5F2E8' },
      accent: { base: '#FF1B6B', legend: '#FFFFFF' },
      numpad: { base: '#F5F2E8', legend: '#1A1A1D' },
      space:  { base: '#1A1A1D', legend: '#F5F2E8' },
    },
  },
  {
    id: 'gmk-cyl-nautilus',
    name: 'GMK Cyl Nautilus',
    description: 'Cylindrical Nautilus: deeper navy with cyan accents. Updated modern classic.',
    credits: 'Designed by Zambumon. Color codes: GMK 5805 / WS1 / accent Pantone 319C.',
    colors: {
      alpha:  { base: '#0F2A4A', legend: '#E8E4DC' },
      mod:    { base: '#1E3A5F', legend: '#E8E4DC' },
      accent: { base: '#5BC0BE', legend: '#0F2A4A' },
      numpad: { base: '#0F2A4A', legend: '#E8E4DC' },
      space:  { base: '#1E3A5F', legend: '#E8E4DC' },
    },
  },
  {
    id: 'gmk-mono-v2',
    name: 'GMK Mono v2',
    description: 'Refined monochrome: pure white alphas, pure black mods, with a single accent gold ESC.',
    credits: 'Designed by biip. Color codes: GMK WS1 / N9 / accent Pantone 871C.',
    colors: {
      alpha:  { base: '#F8F5EC', legend: '#1A1A1D' },
      mod:    { base: '#1A1A1D', legend: '#F8F5EC' },
      accent: { base: '#D4A547', legend: '#1A1A1D' },
      numpad: { base: '#F8F5EC', legend: '#1A1A1D' },
      space:  { base: '#1A1A1D', legend: '#F8F5EC' },
    },
  },
  {
    id: 'gmk-demon-sword',
    name: 'GMK Demon Sword',
    description: 'Crimson-and-steel: red alphas with steel-grey mods and gold accent. Anime-battle aesthetic.',
    credits: 'Designed by kingnestea. Color codes: Pantone 7427C / 7540C / accent 871C.',
    colors: {
      alpha:  { base: '#8B1F1F', legend: '#F5E6C8' },
      mod:    { base: '#4A4D54', legend: '#F5E6C8' },
      accent: { base: '#D4A547', legend: '#4A4D54' },
      numpad: { base: '#8B1F1F', legend: '#F5E6C8' },
      space:  { base: '#4A4D54', legend: '#F5E6C8' },
    },
  },
  {
    id: 'gmk-asteroid-planet',
    name: 'GMK Asteroid Planet',
    description: 'Cosmic grey alphas with orange mods and white accent. Deep-space mining vibe.',
    credits: 'Designed by KINGNESTEA. Color codes: Pantone 7540C / 1655C / accent 7551C.',
    colors: {
      alpha:  { base: '#5A5A5F', legend: '#F5F2E8' },
      mod:    { base: '#D4654B', legend: '#FFFFFF' },
      accent: { base: '#F5F2E8', legend: '#5A5A5F' },
      numpad: { base: '#5A5A5F', legend: '#F5F2E8' },
      space:  { base: '#D4654B', legend: '#FFFFFF' },
    },
  },
  {
    id: 'gmk-tartarus',
    name: 'GMK Tartarus',
    description: 'Greek underworld: deep red alphas with charcoal mods and bronze accent. Mythological drama.',
    credits: 'Designed by Jono. Color codes: Pantone 7421C / 426C / accent 871C.',
    colors: {
      alpha:  { base: '#7B1F1F', legend: '#E8E0CC' },
      mod:    { base: '#1F1F23', legend: '#E8E0CC' },
      accent: { base: '#8B6F2C', legend: '#1F1F23' },
      numpad: { base: '#7B1F1F', legend: '#E8E0CC' },
      space:  { base: '#1F1F23', legend: '#E8E0CC' },
    },
  },
  {
    id: 'gmk-plum',
    name: 'GMK Plum',
    description: 'Plum-purple alphas with cream legends and pink accent. Soft, fruity, summery.',
    credits: 'Designed by Janglad. Color codes: Pantone 7662C / 7527C / accent 2035C.',
    colors: {
      alpha:  { base: '#5C3A6B', legend: '#F5EFE0' },
      mod:    { base: '#3D2A4F', legend: '#F5EFE0' },
      accent: { base: '#FF8FA8', legend: '#3D2A4F' },
      numpad: { base: '#5C3A6B', legend: '#F5EFE0' },
      space:  { base: '#3D2A4F', legend: '#F5EFE0' },
    },
  },
  {
    id: 'gmk-elephant',
    name: 'GMK Elephant',
    description: 'Elephant grey alphas with pink mods and white accent. Gentle-giant palette.',
    credits: 'Designed by Zambumon. Color codes: Pantone 7540C / 2035C / accent 7527C.',
    colors: {
      alpha:  { base: '#7A7A7F', legend: '#F5F2E8' },
      mod:    { base: '#E8A8B8', legend: '#3A2818' },
      accent: { base: '#F5F2E8', legend: '#7A7A7F' },
      numpad: { base: '#7A7A7F', legend: '#F5F2E8' },
      space:  { base: '#E8A8B8', legend: '#3A2818' },
    },
  },

  // ─── MT3 (Drop profile) classics ──────────────────────────────────────
  {
    id: 'mt3-susuwatari',
    name: 'MT3 Susuwatari',
    description: 'Soot-spirit black alphas with off-white legends and red accent. Studio Ghibli-inspired.',
    credits: 'Designed by Matt3o for Drop. MT3 profile, dye-sublimated PBT.',
    colors: {
      alpha:  { base: '#2A2A2E', legend: '#E8E4DC' },
      mod:    { base: '#1A1A1D', legend: '#E8E4DC' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#2A2A2E', legend: '#E8E4DC' },
      space:  { base: '#1A1A1D', legend: '#E8E4DC' },
    },
  },
  {
    id: 'mt3-dev-tty',
    name: 'MT3 /dev/tty',
    description: 'Pure terminal aesthetic: black alphas, green legends, amber accents. CRT-TTY palette.',
    credits: 'Designed by Matt3o for Drop. MT3 profile, dye-sublimated PBT.',
    colors: {
      alpha:  { base: '#0A0A0A', legend: '#3FD43F' },
      mod:    { base: '#1A1A1A', legend: '#FFB830' },
      accent: { base: '#FFB830', legend: '#0A0A0A' },
      numpad: { base: '#0A0A0A', legend: '#3FD43F' },
      space:  { base: '#1A1A1A', legend: '#FFB830' },
    },
  },
  {
    id: 'mt3-bog',
    name: 'MT3 Bog',
    description: 'Bog-moss greens and earthy browns. Wetlands-naturalist aesthetic.',
    credits: 'Designed by Matt3o for Drop. MT3 profile, dye-sublimated PBT.',
    colors: {
      alpha:  { base: '#4A5D3F', legend: '#E8DEC8' },
      mod:    { base: '#3A2818', legend: '#E8DEC8' },
      accent: { base: '#D4A547', legend: '#3A2818' },
      numpad: { base: '#4A5D3F', legend: '#E8DEC8' },
      space:  { base: '#3A2818', legend: '#E8DEC8' },
    },
  },
  {
    id: 'mt3-olivetti',
    name: 'MT3 Olivetti',
    description: 'Italian typewriter aesthetic: cream alphas with red legends and blue accent. Olivetti-Valentine vibe.',
    credits: 'Designed by Matt3o for Drop. MT3 profile, dye-sublimated PBT.',
    colors: {
      alpha:  { base: '#F5EFE0', legend: '#C8302C' },
      mod:    { base: '#C8302C', legend: '#F5EFE0' },
      accent: { base: '#2A6FCC', legend: '#F5EFE0' },
      numpad: { base: '#F5EFE0', legend: '#C8302C' },
      space:  { base: '#C8302C', legend: '#F5EFE0' },
    },
  },

  // ─── Additional KeyKobo ───────────────────────────────────────────────
  {
    id: 'kk-mono-japanese',
    name: 'KeyKobo Mono Japanese',
    description: 'Pure monochrome with hiragana sublegends. Japanese minimalism at its purest.',
    credits: 'Designed by KeyKobo. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#F5F2E8', legend: '#1A1A1D' },
      mod:    { base: '#1A1A1D', legend: '#F5F2E8' },
      accent: { base: '#8B1F1F', legend: '#F5F2E8' },
      numpad: { base: '#F5F2E8', legend: '#1A1A1D' },
      space:  { base: '#1A1A1D', legend: '#F5F2E8' },
    },
  },
  {
    id: 'kk-midnight',
    name: 'KeyKobo Midnight',
    description: 'Midnight-navy alphas with cyan legends and silver accent. Late-night-coding palette.',
    credits: 'Designed by KeyKobo. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#0F1B2E', legend: '#5BC0BE' },
      mod:    { base: '#070D1A', legend: '#5BC0BE' },
      accent: { base: '#C8C8C8', legend: '#0F1B2E' },
      numpad: { base: '#0F1B2E', legend: '#5BC0BE' },
      space:  { base: '#070D1A', legend: '#5BC0BE' },
    },
  },
  {
    id: 'kk-strawberry-milk',
    name: 'KeyKobo Strawberry Milk',
    description: 'Pale strawberry-pink alphas with cream legends and berry-red accent. Sweet & soft.',
    credits: 'Designed by KeyKobo. PBT dye-sub, pastel palette.',
    colors: {
      alpha:  { base: '#F5D5DC', legend: '#7A2A3A' },
      mod:    { base: '#FDF6E3', legend: '#7A2A3A' },
      accent: { base: '#C8443C', legend: '#FDF6E3' },
      numpad: { base: '#F5D5DC', legend: '#7A2A3A' },
      space:  { base: '#FDF6E3', legend: '#7A2A3A' },
    },
  },
  {
    id: 'kk-mid-autumn',
    name: 'KeyKobo Mid-Autumn',
    description: 'Mooncake-festival palette: deep moonlit blue with gold moon accents. Lunar-celebration vibe.',
    credits: 'Designed by KeyKobo. PBT dye-sub, Mid-Autumn Festival-inspired.',
    colors: {
      alpha:  { base: '#1F2A4A', legend: '#F5E6A8' },
      mod:    { base: '#0F1626', legend: '#F5E6A8' },
      accent: { base: '#D4A547', legend: '#0F1626' },
      numpad: { base: '#1F2A4A', legend: '#F5E6A8' },
      space:  { base: '#0F1626', legend: '#F5E6A8' },
    },
  },
  {
    id: 'kk-olive-camo',
    name: 'KeyKobo Olive Camo',
    description: 'Military-olive alphas with khaki mods and orange accent. Tactical-outdoor aesthetic.',
    credits: 'Designed by KeyKobo. PBT dye-sub, military-camo inspired.',
    colors: {
      alpha:  { base: '#4A5A2F', legend: '#E8E0CC' },
      mod:    { base: '#6B5A3A', legend: '#E8E0CC' },
      accent: { base: '#E85D2C', legend: '#1F1F23' },
      numpad: { base: '#4A5A2F', legend: '#E8E0CC' },
      space:  { base: '#6B5A3A', legend: '#E8E0CC' },
    },
  },
  {
    id: 'kk-caramel-vanilla',
    name: 'KeyKobo Caramel Vanilla',
    description: 'Caramel-tan alphas with vanilla-cream mods and chocolate accent. Ice-cream-parlor palette.',
    credits: 'Designed by KeyKobo. PBT dye-sub, dessert-inspired.',
    colors: {
      alpha:  { base: '#C8945A', legend: '#3A2818' },
      mod:    { base: '#FDF6E3', legend: '#5C3A1F' },
      accent: { base: '#5C3A1F', legend: '#FDF6E3' },
      numpad: { base: '#C8945A', legend: '#3A2818' },
      space:  { base: '#FDF6E3', legend: '#5C3A1F' },
    },
  },

  // ─── Additional Akko ──────────────────────────────────────────────────
  {
    id: 'ak-cs-paper',
    name: 'Akko CS Paper',
    description: 'Office-paper white with manila-folder tan mods and red stapler accent. Office-space nostalgia.',
    credits: 'Designed by Akko. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#F5F2E8', legend: '#3A3A3A' },
      mod:    { base: '#D4B886', legend: '#3A3A3A' },
      accent: { base: '#C8302C', legend: '#FFFFFF' },
      numpad: { base: '#F5F2E8', legend: '#3A3A3A' },
      space:  { base: '#D4B886', legend: '#3A3A3A' },
    },
  },
  {
    id: 'ak-silent-dolphin',
    name: 'Akko Silent Dolphin',
    description: 'Dolphin-grey blue with deep navy mods and white accent. Oceanic-mammal palette.',
    credits: 'Designed by Akko. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#6BA3C8', legend: '#F5F8FC' },
      mod:    { base: '#1F3D5C', legend: '#F5F8FC' },
      accent: { base: '#F5F8FC', legend: '#1F3D5C' },
      numpad: { base: '#6BA3C8', legend: '#F5F8FC' },
      space:  { base: '#1F3D5C', legend: '#F5F8FC' },
    },
  },
  {
    id: 'ak-3kingdoms',
    name: 'Akko 3 Kingdoms',
    description: 'Chinese-Three-Kingdoms palette: imperial red, jade green, royal gold. Warring-states drama.',
    credits: 'Designed by Akko. PBT dye-sub, historical-Chinese-inspired.',
    colors: {
      alpha:  { base: '#8B1F1F', legend: '#F5E6C8' },
      mod:    { base: '#2D5A3F', legend: '#F5E6C8' },
      accent: { base: '#D4A547', legend: '#1F1F23' },
      numpad: { base: '#8B1F1F', legend: '#F5E6C8' },
      space:  { base: '#2D5A3F', legend: '#F5E6C8' },
    },
  },

  // ─── Additional Domikey ───────────────────────────────────────────────
  {
    id: 'dom-mecha',
    name: 'Domikey Mecha',
    description: 'Industrial mecha: gunmetal alphas with red legends and yellow caution accent. Robot-cockpit vibe.',
    credits: 'Designed by Domikey. PBT dye-sub, anime-mecha-inspired.',
    colors: {
      alpha:  { base: '#3A3D44', legend: '#D74B4B' },
      mod:    { base: '#25272B', legend: '#E8E4DC' },
      accent: { base: '#FFD23F', legend: '#1F1F23' },
      numpad: { base: '#3A3D44', legend: '#D74B4B' },
      space:  { base: '#25272B', legend: '#E8E4DC' },
    },
  },
  {
    id: 'dom-1989',
    name: 'Domikey 1989',
    description: 'Retro 1989 palette: warm beige with brick-red mods and forest-green accent. Late-80s office.',
    credits: 'Designed by Domikey. PBT dye-sub, retro-styled.',
    colors: {
      alpha:  { base: '#D4C8A0', legend: '#3A2818' },
      mod:    { base: '#8B1F1F', legend: '#F5E6C8' },
      accent: { base: '#2D5A3F', legend: '#F5E6C8' },
      numpad: { base: '#D4C8A0', legend: '#3A2818' },
      space:  { base: '#8B1F1F', legend: '#F5E6C8' },
    },
  },

  // ─── Additional JTK ───────────────────────────────────────────────────
  {
    id: 'jt-umbra',
    name: 'JTK Umbra',
    description: 'Shadow-grey alphas with deeper grey mods and accent crimson. Subtle, sophisticated, sharp.',
    credits: 'Designed by JTK. ABS double-shot, Cherry profile.',
    colors: {
      alpha:  { base: '#3A3D44', legend: '#C8CDD2' },
      mod:    { base: '#1A1A1D', legend: '#C8CDD2' },
      accent: { base: '#8B1F1F', legend: '#FFFFFF' },
      numpad: { base: '#3A3D44', legend: '#C8CDD2' },
      space:  { base: '#1A1A1D', legend: '#C8CDD2' },
    },
  },
  {
    id: 'jt-night-vision',
    name: 'JTK Night Vision',
    description: 'Tactical NVG-green alphas with black mods and amber accent. Night-vision-goggle palette.',
    credits: 'Designed by JTK. ABS double-shot, Cherry profile.',
    colors: {
      alpha:  { base: '#3D4A2F', legend: '#D4E8B0' },
      mod:    { base: '#1A1A1D', legend: '#3FD43F' },
      accent: { base: '#FFB830', legend: '#1A1A1D' },
      numpad: { base: '#3D4A2F', legend: '#D4E8B0' },
      space:  { base: '#1A1A1D', legend: '#3FD43F' },
    },
  },

  // ─── Additional MiBo ──────────────────────────────────────────────────
  {
    id: 'mb-hanami-dango',
    name: 'MiBo Hanami Dango',
    description: 'Three-color dango: pink, white, green pastels. Cherry-blossom-viewing picnic palette.',
    credits: 'Designed by MiBo. PBT dye-sub, Cherry profile, wagashi-inspired.',
    colors: {
      alpha:  { base: '#F5C8D5', legend: '#5C3A3A' },
      mod:    { base: '#F5F2E8', legend: '#5C3A3A' },
      accent: { base: '#8BA888', legend: '#F5F2E8' },
      numpad: { base: '#F5C8D5', legend: '#5C3A3A' },
      space:  { base: '#F5F2E8', legend: '#5C3A3A' },
    },
  },
  {
    id: 'mb-araigai',
    name: 'MiBo Araigai',
    description: 'Rice-washing shrimp-pink alphas with navy mods and coral accent. Playful sea-life palette.',
    credits: 'Designed by MiBo. PBT dye-sub, Cherry profile.',
    colors: {
      alpha:  { base: '#F5B0A8', legend: '#3A2818' },
      mod:    { base: '#1F2A4A', legend: '#F5E6C8' },
      accent: { base: '#E85D2C', legend: '#FFFFFF' },
      numpad: { base: '#F5B0A8', legend: '#3A2818' },
      space:  { base: '#1F2A4A', legend: '#F5E6C8' },
    },
  },

  // ─── More IDE / theme presets ─────────────────────────────────────────
  {
    id: 'nk-solarized-dark',
    name: 'Solarized Dark',
    description: 'Ethan Schoonover\'s classic: deep base-02 with cyan accents and yellow highlights. Programmer\'s darling.',
    credits: 'Inspired by Ethan Schoonover Solarized Dark color scheme.',
    colors: {
      alpha:  { base: '#073642', legend: '#93A1A1' },
      mod:    { base: '#002B36', legend: '#93A1A1' },
      accent: { base: '#B58900', legend: '#002B36' },
      numpad: { base: '#073642', legend: '#93A1A1' },
      space:  { base: '#002B36', legend: '#93A1A1' },
    },
  },
  {
    id: 'nk-solarized-light',
    name: 'Solarized Light',
    description: 'Solarized\'s lighter side: warm base-3 with cyan accents and orange highlights. Easy on the eyes.',
    credits: 'Inspired by Ethan Schoonover Solarized Light color scheme.',
    colors: {
      alpha:  { base: '#EEE8D5', legend: '#586E75' },
      mod:    { base: '#FDF6E3', legend: '#586E75' },
      accent: { base: '#CB4B16', legend: '#FDF6E3' },
      numpad: { base: '#EEE8D5', legend: '#586E75' },
      space:  { base: '#FDF6E3', legend: '#586E75' },
    },
  },
  {
    id: 'nk-one-dark',
    name: 'One Dark',
    description: 'Atom\'s One Dark: cool dark base with cyan/purple/red syntax colors. Modern-editor classic.',
    credits: 'Inspired by Atom One Dark color scheme.',
    colors: {
      alpha:  { base: '#282C34', legend: '#ABB2BF' },
      mod:    { base: '#21252B', legend: '#61AFEF' },
      accent: { base: '#E06C75', legend: '#21252B' },
      numpad: { base: '#282C34', legend: '#ABB2BF' },
      space:  { base: '#21252B', legend: '#61AFEF' },
    },
  },
  {
    id: 'nk-material',
    name: 'Material Theme',
    description: 'Material Design-inspired: deep ocean palette with pink, cyan, and lime syntax accents.',
    credits: 'Inspired by Material Theme color scheme.',
    colors: {
      alpha:  { base: '#263238', legend: '#B2CCD6' },
      mod:    { base: '#1E272C', legend: '#82AAFF' },
      accent: { base: '#FF5370', legend: '#1E272C' },
      numpad: { base: '#263238', legend: '#B2CCD6' },
      space:  { base: '#1E272C', legend: '#82AAFF' },
    },
  },
  {
    id: 'nk-monokai',
    name: 'Monokai Pro',
    description: 'Wesbos\'s classic syntax theme: dark grey alphas with pink, yellow, green legends. Iconic.',
    credits: 'Inspired by Monokai Pro color scheme.',
    colors: {
      alpha:  { base: '#2D2A2E', legend: '#FCFCFA' },
      mod:    { base: '#1F1E1F', legend: '#FF6188' },
      accent: { base: '#FFD866', legend: '#1F1E1F' },
      numpad: { base: '#2D2A2E', legend: '#FCFCFA' },
      space:  { base: '#1F1E1F', legend: '#FF6188' },
    },
  },
  {
    id: 'nk-dracula-soft',
    name: 'Dracula Soft',
    description: 'Softer Dracula variant: muted purple with softer pinks and cyan. Less harsh, more pastel.',
    credits: 'Inspired by Dracula Soft variant.',
    colors: {
      alpha:  { base: '#36313D', legend: '#D6B8D8' },
      mod:    { base: '#28252D', legend: '#9DD8E0' },
      accent: { base: '#F0A8C8', legend: '#28252D' },
      numpad: { base: '#36313D', legend: '#D6B8D8' },
      space:  { base: '#28252D', legend: '#9DD8E0' },
    },
  },
  {
    id: 'nk-everforest',
    name: 'Everforest',
    description: 'Forest-themed: warm dark green with cream legends and orange accent. Woodland coder palette.',
    credits: 'Inspired by sainnhe Everforest color scheme.',
    colors: {
      alpha:  { base: '#323D43', legend: '#D3C6AA' },
      mod:    { base: '#2B3339', legend: '#A7C080' },
      accent: { base: '#E67E80', legend: '#2B3339' },
      numpad: { base: '#323D43', legend: '#D3C6AA' },
      space:  { base: '#2B3339', legend: '#A7C080' },
    },
  },
  {
    id: 'nk-kanagawa',
    name: 'Kanagawa',
    description: 'The Great Wave off Kanagawa: deep sumi-ink blue with cherry-blossom pink and autumn-orange accents.',
    credits: 'Inspired by rebelot Kanagawa color scheme.',
    colors: {
      alpha:  { base: '#1F1F28', legend: '#DCD7BA' },
      mod:    { base: '#16161D', legend: '#7E9CD8' },
      accent: { base: '#FF5D62', legend: '#16161D' },
      numpad: { base: '#1F1F28', legend: '#DCD7BA' },
      space:  { base: '#16161D', legend: '#7E9CD8' },
    },
  },

  // ─── Classic / vintage keyboard originals ─────────────────────────────
  {
    id: 'ibm-model-m',
    name: 'IBM Model M',
    description: 'IBM Industrial: pearl-cream alphas with pebble-grey mods. The keyboard that defined an era.',
    credits: 'IBM Model M stock keycaps. PBT dye-sub, buckling-spring.',
    colors: {
      alpha:  { base: '#E8E0CC', legend: '#1F1F23' },
      mod:    { base: '#A8A090', legend: '#1F1F23' },
      accent: { base: '#1F1F23', legend: '#E8E0CC' },
      numpad: { base: '#E8E0CC', legend: '#1F1F23' },
      space:  { base: '#A8A090', legend: '#1F1F23' },
    },
  },
  {
    id: 'ibm-beamspring',
    name: 'IBM Beamspring',
    description: '1970s beamspring palette: warm cream with deep blue-grey mods. Vintage mainframe aesthetic.',
    credits: 'IBM Beamspring stock keycaps. PBT dye-sub.',
    colors: {
      alpha:  { base: '#F0E8D0', legend: '#2D3A4F' },
      mod:    { base: '#5A6B7F', legend: '#F0E8D0' },
      accent: { base: '#8B1F1F', legend: '#F0E8D0' },
      numpad: { base: '#F0E8D0', legend: '#2D3A4F' },
      space:  { base: '#5A6B7F', legend: '#F0E8D0' },
    },
  },
  {
    id: 'apple-extended-ii',
    name: 'Apple Extended II',
    description: 'Apple Extended Keyboard II: warm platinum alphas with peach mods. 1990s Apple design language.',
    credits: 'Apple Extended Keyboard II stock keycaps. PBT dye-sub.',
    colors: {
      alpha:  { base: '#E8DEC8', legend: '#3A2818' },
      mod:    { base: '#D4B894', legend: '#3A2818' },
      accent: { base: '#8B1F1F', legend: '#F5EDD8' },
      numpad: { base: '#E8DEC8', legend: '#3A2818' },
      space:  { base: '#D4B894', legend: '#3A2818' },
    },
  },

  // ─── Brand crossovers & limited editions ──────────────────────────────
  {
    id: 'gmk-ramen-night',
    name: 'GMK Ramen Night',
    description: 'Late-night ramen palette: warm orange broth alphas with brown noodle mods and nori-green accent.',
    credits: 'Designed by Kingnestea. Color codes: Pantone 1495C / 7553C / 5535C.',
    colors: {
      alpha:  { base: '#E89B4B', legend: '#3A2818' },
      mod:    { base: '#5C3A1F', legend: '#F5E6C8' },
      accent: { base: '#2D5A3F', legend: '#F5E6C8' },
      numpad: { base: '#E89B4B', legend: '#3A2818' },
      space:  { base: '#5C3A1F', legend: '#F5E6C8' },
    },
  },
  {
    id: 'gmk-sushi',
    name: 'GMK Sushi',
    description: 'Sushi-platter palette: rice-white alphas with nori-green mods and salmon-pink accent.',
    credits: 'Designed by Kingnestea. Color codes: Pantone 7527C / 5535C / 170C.',
    colors: {
      alpha:  { base: '#FDF6E3', legend: '#2D5A3F' },
      mod:    { base: '#2D5A3F', legend: '#FDF6E3' },
      accent: { base: '#E88B7A', legend: '#FDF6E3' },
      numpad: { base: '#FDF6E3', legend: '#2D5A3F' },
      space:  { base: '#2D5A3F', legend: '#FDF6E3' },
    },
  },
  {
    id: 'gmk-nord-light',
    name: 'GMK Nord Light',
    description: 'Light variant of arctic Nord: glacier-mint alphas with deep slate mods and frost-white accent.',
    credits: 'Designed by T0mb3ry. Color codes: Pantone 5527C / 432C / accent 7541C.',
    colors: {
      alpha:  { base: '#B8D5C8', legend: '#2E3440' },
      mod:    { base: '#2E3440', legend: '#D8DEE9' },
      accent: { base: '#ECEFF4', legend: '#2E3440' },
      numpad: { base: '#B8D5C8', legend: '#2E3440' },
      space:  { base: '#2E3440', legend: '#D8DEE9' },
    },
  },
  {
    id: 'gmk-aurora-polaris',
    name: 'GMK Aurora Polaris',
    description: 'Northern-lights palette: dark midnight-blue with green-cyan aurora accents. Arctic-night aesthetic.',
    credits: 'Designed by Oblotzky. Color codes: Pantone 5405C / 3272C / accent 2728C.',
    colors: {
      alpha:  { base: '#1F3D5C', legend: '#5BC0BE' },
      mod:    { base: '#0F1E3A', legend: '#5BC0BE' },
      accent: { base: '#7B4FD4', legend: '#0F1E3A' },
      numpad: { base: '#1F3D5C', legend: '#5BC0BE' },
      space:  { base: '#0F1E3A', legend: '#5BC0BE' },
    },
  },
  {
    id: 'gmk-scorpio',
    name: 'GMK Scorpio',
    description: 'Zodiac Scorpio: deep blood-red alphas with charcoal mods and gold accent. Passionate, intense.',
    credits: 'Designed by pixel art. Color codes: Pantone 7421C / 426C / accent 871C.',
    colors: {
      alpha:  { base: '#5C1F1F', legend: '#E8E0CC' },
      mod:    { base: '#1F1F23', legend: '#E8E0CC' },
      accent: { base: '#D4A547', legend: '#1F1F23' },
      numpad: { base: '#5C1F1F', legend: '#E8E0CC' },
      space:  { base: '#1F1F23', legend: '#E8E0CC' },
    },
  },
  {
    id: 'gmk-fuyu',
    name: 'GMK Fuyu',
    description: 'Japanese winter (Fuyu): snow-white alphas with cold-blue mods and warm red accent. Winter-solstice palette.',
    credits: 'Designed by kingnestea. Color codes: Pantone 7541C / 5405C / accent 7427C.',
    colors: {
      alpha:  { base: '#F5F2E8', legend: '#1F3D5C' },
      mod:    { base: '#1F3D5C', legend: '#F5F2E8' },
      accent: { base: '#8B1F1F', legend: '#F5F2E8' },
      numpad: { base: '#F5F2E8', legend: '#1F3D5C' },
      space:  { base: '#1F3D5C', legend: '#F5F2E8' },
    },
  },
  {
    id: 'gmk-mizu-v2',
    name: 'GMK Mizu V2',
    description: 'Mizu V2 — brighter water-themed palette with cyan alphas, navy mods, and pink accent.',
    credits: 'Designed by Rensuya. Updated V2 palette.',
    colors: {
      alpha:  { base: '#5BC0BE', legend: '#FFFFFF' },
      mod:    { base: '#1F3D5C', legend: '#5BC0BE' },
      accent: { base: '#FF6BA8', legend: '#1F3D5C' },
      numpad: { base: '#5BC0BE', legend: '#FFFFFF' },
      space:  { base: '#1F3D5C', legend: '#5BC0BE' },
    },
  },
  {
    id: 'gmk-tokyo-night-glow',
    name: 'GMK Tokyo Night Glow',
    description: 'Tokyo-at-night glowing variant: deep night blue with neon-cyan legends and magenta accent.',
    credits: 'Inspired by enkia Tokyo Night theme. GMK colorway adaptation.',
    colors: {
      alpha:  { base: '#1A1B26', legend: '#7DCFFF' },
      mod:    { base: '#16161E', legend: '#7AA2F7' },
      accent: { base: '#BB9AF7', legend: '#16161E' },
      numpad: { base: '#1A1B26', legend: '#7DCFFF' },
      space:  { base: '#16161E', legend: '#7AA2F7' },
    },
  },

  // ─── Limited / designer sets ──────────────────────────────────────────
  {
    id: 'gmk-kapcom',
    name: 'GMK Kapcom',
    description: 'Capcom-arcade-inspired: red alphas with white legends and yellow accent. Street-Fighter era.',
    credits: 'Designed by Halo. Color codes: Pantone 485C / 7527C / accent 109C.',
    colors: {
      alpha:  { base: '#C8302C', legend: '#FFFFFF' },
      mod:    { base: '#1F1F23', legend: '#FFFFFF' },
      accent: { base: '#FFD23F', legend: '#1F1F23' },
      numpad: { base: '#C8302C', legend: '#FFFFFF' },
      space:  { base: '#1F1F23', legend: '#FFFFFF' },
    },
  },
  {
    id: 'gmk-touhou',
    name: 'GMK Touhou',
    description: 'Touhou-Project-inspired: red shrine-maiden alphas with white mods and teal accent. Anime-game palette.',
    credits: 'Designed by Zzytx. Color codes: Pantone 7427C / 7527C / accent 3272C.',
    colors: {
      alpha:  { base: '#8B1F1F', legend: '#F5F2E8' },
      mod:    { base: '#F5F2E8', legend: '#8B1F1F' },
      accent: { base: '#2A9D8F', legend: '#F5F2E8' },
      numpad: { base: '#8B1F1F', legend: '#F5F2E8' },
      space:  { base: '#F5F2E8', legend: '#8B1F1F' },
    },
  },
  {
    id: 'gmk-valentine',
    name: 'GMK Valentine',
    description: 'Valentine\'s Day: soft pink alphas with cream legends and deep-red accent. Romantic & sweet.',
    credits: 'Designed by bunny. Color codes: Pantone 2035C / 7527C / accent 7427C.',
    colors: {
      alpha:  { base: '#F5C8D5', legend: '#5C3A3A' },
      mod:    { base: '#FDF6E3', legend: '#5C3A3A' },
      accent: { base: '#8B1F1F', legend: '#FDF6E3' },
      numpad: { base: '#F5C8D5', legend: '#5C3A3A' },
      space:  { base: '#FDF6E3', legend: '#5C3A3A' },
    },
  },
  {
    id: 'gmk-halloween',
    name: 'GMK Halloween',
    description: 'Spooky palette: jet-black alphas with orange legends and purple accent. Trick-or-treat aesthetic.',
    credits: 'Designed by Lightning. Color codes: Pantone 426C / 1505C / accent 2685C.',
    colors: {
      alpha:  { base: '#1F1F23', legend: '#E85D2C' },
      mod:    { base: '#0D0D10', legend: '#E85D2C' },
      accent: { base: '#7B2D8C', legend: '#FFFFFF' },
      numpad: { base: '#1F1F23', legend: '#E85D2C' },
      space:  { base: '#0D0D10', legend: '#E85D2C' },
    },
  },
  {
    id: 'gmk-christmas',
    name: 'GMK Christmas',
    description: 'Holiday palette: forest-green alphas with red mods and cream accent. Christmas-morning vibe.',
    credits: 'Designed by Plastik. Color codes: Pantone 5535C / 7427C / accent 7527C.',
    colors: {
      alpha:  { base: '#2D5A3F', legend: '#F5E6C8' },
      mod:    { base: '#8B1F1F', legend: '#F5E6C8' },
      accent: { base: '#F5E6C8', legend: '#8B1F1F' },
      numpad: { base: '#2D5A3F', legend: '#F5E6C8' },
      space:  { base: '#8B1F1F', legend: '#F5E6C8' },
    },
  },
  {
    id: 'gmk-st-patrick',
    name: 'GMK St Patrick',
    description: 'Irush St-Patrick\'s palette: emerald-green alphas with gold mods and accent. Lucky-clover aesthetic.',
    credits: 'Designed by Jango. Color codes: Pantone 354C / 871C / accent 109C.',
    colors: {
      alpha:  { base: '#1F8B3F', legend: '#F5E6C8' },
      mod:    { base: '#D4A547', legend: '#1F1F23' },
      accent: { base: '#1F1F23', legend: '#D4A547' },
      numpad: { base: '#1F8B3F', legend: '#F5E6C8' },
      space:  { base: '#D4A547', legend: '#1F1F23' },
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
    name: design.name === 'Untitled Design' || design.name.startsWith('GMK') || design.name.startsWith('ePBT') || design.name.startsWith('SP') || design.name.startsWith('PBTfans')
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
