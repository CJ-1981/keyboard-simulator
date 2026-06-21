import type { LayoutDef } from '../store/types';

/**
 * Full 108-key (ANSI) layout.
 *
 * Grid: ~25u wide × 6u tall (including nav cluster + numpad)
 *
 * Row layout (y, sculptRow):
 *   y=0  R-function row (sculptRow 5)
 *   y=1  R-number row (sculptRow 4)
 *   y=2  R-top alpha (sculptRow 3)
 *   y=3  R-home row (sculptRow 2)
 *   y=4  R-bottom alpha (sculptRow 1)
 *   y=5  R-space row (sculptRow 1, taller keys)
 *
 * Region codes:
 *   alpha    — main letter keys
 *   mod      — modifiers, function keys, arrows
 *   accent   — ESC key (default accent)
 *   numpad   — numeric keypad
 *   space    — spacebar
 */

export const full108: LayoutDef = {
  id: 'full108',
  name: 'Full 108',
  widthU: 25.5,  // max key x=24.5 + 1u width = 25.5
  heightU: 6,    // 6 rows (y=0..5)
  keys: [
    // ─── Row 0: Function row ───
    { id: 'K_ESC',  legend: 'ESC', region: 'accent', x: 0,    y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F1',   legend: 'F1',  region: 'mod',    x: 2,    y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F2',   legend: 'F2',  region: 'mod',    x: 3,    y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F3',   legend: 'F3',  region: 'mod',    x: 4,    y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F4',   legend: 'F4',  region: 'mod',    x: 5,    y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F5',   legend: 'F5',  region: 'mod',    x: 6.5,  y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F6',   legend: 'F6',  region: 'mod',    x: 7.5,  y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F7',   legend: 'F7',  region: 'mod',    x: 8.5,  y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F8',   legend: 'F8',  region: 'mod',    x: 9.5,  y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F9',   legend: 'F9',  region: 'mod',    x: 11,   y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F10',  legend: 'F10', region: 'mod',    x: 12,   y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F11',  legend: 'F11', region: 'mod',    x: 13,   y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_F12',  legend: 'F12', region: 'mod',    x: 14,   y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_PRT',  legend: 'PRT', region: 'mod',    x: 15.25,y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_SCL',  legend: 'SCL', region: 'mod',    x: 16.25,y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_PAU',  legend: 'PAU', region: 'mod',    x: 17.25,y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_INS',  legend: 'INS', region: 'mod',    x: 18.5, y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_HOM',  legend: 'HOM', region: 'mod',    x: 19.5, y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_PGU',  legend: 'PGU', region: 'mod',    x: 20.5, y: 0, w: 1, h: 1, sculptRow: 5 },
    { id: 'K_NL',   legend: 'NLK', region: 'numpad', x: 21.5, y: 0, w: 1, h: 1, sculptRow: 5 },

    // ─── Row 1: Number row ───
    { id: 'K_TILD', legend: '`',   region: 'alpha',  x: 0,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_1',    legend: '1',   region: 'alpha',  x: 1,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_2',    legend: '2',   region: 'alpha',  x: 2,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_3',    legend: '3',   region: 'alpha',  x: 3,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_4',    legend: '4',   region: 'alpha',  x: 4,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_5',    legend: '5',   region: 'alpha',  x: 5,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_6',    legend: '6',   region: 'alpha',  x: 6,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_7',    legend: '7',   region: 'alpha',  x: 7,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_8',    legend: '8',   region: 'alpha',  x: 8,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_9',    legend: '9',   region: 'alpha',  x: 9,    y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_0',    legend: '0',   region: 'alpha',  x: 10,   y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_MINS', legend: '-',   region: 'alpha',  x: 11,   y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_EQ',   legend: '=',   region: 'alpha',  x: 12,   y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_BSP',  legend: 'BSP', region: 'mod',    x: 13,   y: 1, w: 2, h: 1, sculptRow: 4 },
    { id: 'K_DEL',  legend: 'DEL', region: 'mod',    x: 18.5, y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_END',  legend: 'END', region: 'mod',    x: 19.5, y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_PGD',  legend: 'PGD', region: 'mod',    x: 20.5, y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_N7',   legend: '7',   region: 'numpad', x: 21.5, y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_N8',   legend: '8',   region: 'numpad', x: 22.5, y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_N9',   legend: '9',   region: 'numpad', x: 23.5, y: 1, w: 1, h: 1, sculptRow: 4 },
    { id: 'K_NML',  legend: '-',   region: 'numpad', x: 24.5, y: 1, w: 1, h: 1, sculptRow: 4 },

    // ─── Row 2: Top alpha (TAB row) ───
    { id: 'K_TAB',  legend: 'TAB', region: 'mod',    x: 0,    y: 2, w: 1.5, h: 1, sculptRow: 3 },
    { id: 'K_Q',    legend: 'Q',   region: 'alpha',  x: 1.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_W',    legend: 'W',   region: 'alpha',  x: 2.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_E',    legend: 'E',   region: 'alpha',  x: 3.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_R',    legend: 'R',   region: 'alpha',  x: 4.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_T',    legend: 'T',   region: 'alpha',  x: 5.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_Y',    legend: 'Y',   region: 'alpha',  x: 6.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_U',    legend: 'U',   region: 'alpha',  x: 7.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_I',    legend: 'I',   region: 'alpha',  x: 8.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_O',    legend: 'O',   region: 'alpha',  x: 9.5,  y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_P',    legend: 'P',   region: 'alpha',  x: 10.5, y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_LB',   legend: '[',   region: 'alpha',  x: 11.5, y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_RB',   legend: ']',   region: 'alpha',  x: 12.5, y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_BS',   legend: '\\',  region: 'alpha',  x: 13.5, y: 2, w: 1.5, h: 1, sculptRow: 3 },
    { id: 'K_N4',   legend: '4',   region: 'numpad', x: 21.5, y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_N5',   legend: '5',   region: 'numpad', x: 22.5, y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_N6',   legend: '6',   region: 'numpad', x: 23.5, y: 2, w: 1, h: 1, sculptRow: 3 },
    { id: 'K_NPL',  legend: '+',   region: 'numpad', x: 24.5, y: 2, w: 1, h: 1, sculptRow: 3 },

    // ─── Row 3: Home row (CAPS) ───
    { id: 'K_CAPS', legend: 'CAPS',region: 'mod',    x: 0,    y: 3, w: 1.75, h: 1, sculptRow: 2 },
    { id: 'K_A',    legend: 'A',   region: 'alpha',  x: 1.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_S',    legend: 'S',   region: 'alpha',  x: 2.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_D',    legend: 'D',   region: 'alpha',  x: 3.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_F',    legend: 'F',   region: 'alpha',  x: 4.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_G',    legend: 'G',   region: 'alpha',  x: 5.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_H',    legend: 'H',   region: 'alpha',  x: 6.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_J',    legend: 'J',   region: 'alpha',  x: 7.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_K',    legend: 'K',   region: 'alpha',  x: 8.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_L',    legend: 'L',   region: 'alpha',  x: 9.75, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_SEMI', legend: ';',   region: 'alpha',  x: 10.75,y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_QUOT', legend: "'",   region: 'alpha',  x: 11.75,y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_ENT',  legend: 'ENT', region: 'mod',    x: 12.75,y: 3, w: 2.25, h: 1, sculptRow: 2 },
    { id: 'K_N1',   legend: '1',   region: 'numpad', x: 21.5, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_N2',   legend: '2',   region: 'numpad', x: 22.5, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_N3',   legend: '3',   region: 'numpad', x: 23.5, y: 3, w: 1, h: 1, sculptRow: 2 },
    { id: 'K_NEN',  legend: 'ENT', region: 'numpad', x: 24.5, y: 3, w: 1, h: 2, sculptRow: 2 },

    // ─── Row 4: Bottom alpha (SHIFT row) ───
    { id: 'K_LSFT', legend: 'SHFT',region: 'mod',    x: 0,    y: 4, w: 2.25, h: 1, sculptRow: 1 },
    { id: 'K_Z',    legend: 'Z',   region: 'alpha',  x: 2.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_X',    legend: 'X',   region: 'alpha',  x: 3.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_C',    legend: 'C',   region: 'alpha',  x: 4.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_V',    legend: 'V',   region: 'alpha',  x: 5.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_B',    legend: 'B',   region: 'alpha',  x: 6.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_N',    legend: 'N',   region: 'alpha',  x: 7.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_M',    legend: 'M',   region: 'alpha',  x: 8.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_COM',  legend: ',',   region: 'alpha',  x: 9.25, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_DOT',  legend: '.',   region: 'alpha',  x: 10.25,y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_SLS',  legend: '/',   region: 'alpha',  x: 11.25,y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_RSFT', legend: 'SHFT',region: 'mod',    x: 12.25,y: 4, w: 2.75, h: 1, sculptRow: 1 },
    { id: 'K_UP',   legend: '↑',   region: 'mod',    x: 20.5, y: 4, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_N0',   legend: '0',   region: 'numpad', x: 21.5, y: 4, w: 2, h: 1, sculptRow: 1 },
    { id: 'K_NDT',  legend: '.',   region: 'numpad', x: 23.5, y: 4, w: 1, h: 1, sculptRow: 1 },

    // ─── Row 5: Space row (CTRL / WIN / ALT / SPACE) ───
    { id: 'K_LCTL', legend: 'CTL', region: 'mod',    x: 0,    y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_LWIN', legend: 'WIN', region: 'mod',    x: 1.25, y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_LALT', legend: 'ALT', region: 'mod',    x: 2.5,  y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_SPC',  legend: '',    region: 'space',  x: 3.75, y: 5, w: 6.25, h: 1, sculptRow: 1 },
    { id: 'K_RALT', legend: 'ALT', region: 'mod',    x: 10,   y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_RWIN', legend: 'WIN', region: 'mod',    x: 11.25,y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_MENU', legend: 'MNU', region: 'mod',    x: 12.5, y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_RCTL', legend: 'CTL', region: 'mod',    x: 13.75,y: 5, w: 1.25, h: 1, sculptRow: 1 },
    { id: 'K_LEFT', legend: '←',   region: 'mod',    x: 19.5, y: 5, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_DN',   legend: '↓',   region: 'mod',    x: 20.5, y: 5, w: 1, h: 1, sculptRow: 1 },
    { id: 'K_RGHT', legend: '→',   region: 'mod',    x: 21.5, y: 5, w: 1, h: 1, sculptRow: 1 },
  ],
};

export default full108;
