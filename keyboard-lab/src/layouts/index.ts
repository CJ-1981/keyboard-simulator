import type { LayoutDef, LayoutId } from '../store/types';
import { full108 } from './full108';
import { tkl87 } from './tkl87';
import { percent75 } from './percent75';

export const layouts: Record<LayoutId, LayoutDef> = {
  full108,
  tkl87,
  percent75,
};

export const layoutList: LayoutDef[] = [full108, tkl87, percent75];

export function getLayout(id: LayoutId): LayoutDef {
  return layouts[id];
}
