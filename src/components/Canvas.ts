import { store } from '../store/store';
import { getLayout } from '../layouts';
import { renderKeyboardSVG } from '../render/KeyboardRenderer';

/**
 * Center canvas — renders the SVG keyboard and forwards clicks to the store.
 *
 * Features:
 *   - Click any keycap to select it (shift-click for additive multi-select)
 *   - Zoom in/out via floating buttons, Ctrl+wheel, or pinch-to-zoom on touch
 *   - Pan when zoomed in (drag with mouse or touch)
 *   - Zoom range: 25% to 300%, resets on layout switch
 *   - SVG scales to fit available width at 100% zoom
 */
export function renderCanvas(root: HTMLElement) {
  root.innerHTML = `
    <main class="flex-1 overflow-auto bg-paper p-3 sm:p-6 flex items-center justify-center relative">
      <div id="canvas-container" class="relative" style="max-width:100%;">
        <!-- SVG injected here -->
      </div>
      <!-- Zoom controls (bottom-right of canvas) -->
      <div class="absolute bottom-3 right-3 flex flex-col gap-1 bg-paper/90 backdrop-blur-sm border border-border rounded-lg shadow-sm p-1 z-10">
        <button id="zoom-in" class="w-8 h-8 rounded hover:bg-surface text-ink flex items-center justify-center text-lg font-semibold" title="Zoom in (Ctrl+scroll)">＋</button>
        <button id="zoom-reset" class="w-8 h-8 rounded hover:bg-surface text-ink flex items-center justify-center text-xs font-mono" title="Reset zoom (100%)"><span id="zoom-label">100%</span></button>
        <button id="zoom-out" class="w-8 h-8 rounded hover:bg-surface text-ink flex items-center justify-center text-lg font-semibold" title="Zoom out (Ctrl+scroll)">−</button>
      </div>
    </main>
  `;

  const container = root.querySelector<HTMLElement>('#canvas-container')!;
  const main = root.querySelector<HTMLElement>('main')!;
  const zoomInBtn = root.querySelector<HTMLButtonElement>('#zoom-in')!;
  const zoomOutBtn = root.querySelector<HTMLButtonElement>('#zoom-out')!;
  const zoomResetBtn = root.querySelector<HTMLButtonElement>('#zoom-reset')!;
  const zoomLabel = root.querySelector<HTMLElement>('#zoom-label')!;

  // ─── Zoom state ────────────────────────────────────────────────────────
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 3.0;
  const ZOOM_STEP = 0.1;  // 10% per click
  let zoom = 1.0;
  let baseWidth = 0;  // natural SVG width at scale=1

  function setZoom(newZoom: number) {
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    rerender();
  }

  function updateZoomLabel() {
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  // ─── Delegated click handler ───────────────────────────────────────────
  container.addEventListener('click', (e) => {
    const target = e.target as SVGElement;
    const keyId = target.getAttribute('data-key-id');
    if (keyId) {
      e.stopPropagation();
      store.selectKey(keyId, e.shiftKey);
    }
  });

  // ─── Zoom button handlers ──────────────────────────────────────────────
  zoomInBtn.addEventListener('click', () => setZoom(zoom + ZOOM_STEP));
  zoomOutBtn.addEventListener('click', () => setZoom(zoom - ZOOM_STEP));
  zoomResetBtn.addEventListener('click', () => setZoom(1.0));

  // ─── Ctrl+wheel zoom ──────────────────────────────────────────────────
  main.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Delta > 0 = scroll up = zoom in
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setZoom(zoom + delta);
    }
  }, { passive: false });

  // ─── Touch pinch-to-zoom + pan ─────────────────────────────────────────
  let pinchState: { 
    mode: 'none' | 'pinch' | 'pan';
    startDist?: number;
    startZoom?: number;
    startX?: number;
    startY?: number;
    scrollX?: number;
    scrollY?: number;
  } = { mode: 'none' };

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      // Two-finger pinch
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchState = {
        mode: 'pinch',
        startDist: dist,
        startZoom: zoom,
      };
    } else if (e.touches.length === 1 && zoom > 1.0) {
      // One-finger pan (only when zoomed in)
      const t = e.touches[0];
      pinchState = {
        mode: 'pan',
        startX: t.clientX,
        startY: t.clientY,
        scrollX: main.scrollLeft,
        scrollY: main.scrollTop,
      };
    }
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (pinchState.mode === 'pinch' && e.touches.length === 2 && pinchState.startDist && pinchState.startZoom) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / pinchState.startDist;
      setZoom(pinchState.startZoom * ratio);
    } else if (pinchState.mode === 'pan' && e.touches.length === 1 && pinchState.startX !== undefined) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = pinchState.startX - t.clientX;
      const dy = pinchState.startY! - t.clientY;
      main.scrollLeft = pinchState.scrollX! + dx;
      main.scrollTop = pinchState.scrollY! + dy;
    }
  }, { passive: false });

  container.addEventListener('touchend', () => {
    pinchState = { mode: 'none' };
  });

  // ─── Render ────────────────────────────────────────────────────────────
  function rerender() {
    const layout = getLayout(store.design.layout);
    // Available width = main element client width minus padding; min 280px
    const availW = Math.max(280, main.clientWidth - 24);
    // Render at scale=1 to get natural dimensions
    const { svg, width } = renderKeyboardSVG(layout, store.design.keycaps, {
      selectedKeyIds: store.selectedKeyIds,
      scale: 1,
    });
    baseWidth = width;
    container.innerHTML = svg;

    // Compute effective display width: fit to available width, then apply zoom
    const fitWidth = width > availW ? availW : width;
    const effectiveWidth = fitWidth * zoom;

    const svgEl = container.querySelector('svg');
    if (svgEl) {
      svgEl.style.width = `${effectiveWidth}px`;
      svgEl.style.height = 'auto';
      svgEl.style.maxWidth = 'none';  // allow zoom beyond container
    }
    // Set container width to match so centering works
    container.style.width = `${effectiveWidth}px`;

    updateZoomLabel();
  }

  rerender();
  store.subscribe(rerender);

  // Re-render on viewport resize so the SVG scales with the container
  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rerender, 100);
  });
}
