import type { LayoutDef, LayoutId } from '../store/types';
import { full108 } from './full108';
import { tkl87 } from './tkl87';
import { percent75 } from './percent75';
import { full108Iso } from './full108-iso';
import { tkl88Iso } from './tkl87-iso';
import { percent75Iso } from './percent75-iso';

export const layouts: Record<LayoutId, LayoutDef> = {
  full108,
  tkl87,
  percent75,
  'full108-iso': full108Iso,
  'tkl87-iso': tkl88Iso,
  'percent75-iso': percent75Iso,
};

export const layoutList: LayoutDef[] = [
  full108,
  tkl87,
  percent75,
  full108Iso,
  tkl88Iso,
  percent75Iso,
];

export function getLayout(id: LayoutId): LayoutDef {
  return layouts[id];
}
