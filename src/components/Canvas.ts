import { store } from '../store/store';
import { getLayout } from '../layouts';
import { renderKeyboardSVG } from '../render/KeyboardRenderer';

/**
 * Center canvas — renders the SVG keyboard and forwards clicks to the store.
 *
 * Features:
 *   - Click any keycap to select it (shift-click for additive multi-select)
 *   - Zoom in/out via floating buttons, Ctrl+wheel, or pinch-to-zoom on touch
 *   - Pan when zoomed in: native browser scroll (drag on touch, scroll on desktop)
 *   - Zoom range: 25% to 300%
 *   - SVG scales to fit available width at 100% zoom
 *   - Zoom controls live BELOW the keyboard, centered
 */
export function renderCanvas(root: HTMLElement) {
  root.innerHTML = `
    <main class="flex-1 overflow-auto bg-paper flex flex-col">
      <!-- Keyboard area: scrollable when zoomed in -->
      <div class="flex-1 overflow-auto p-3 sm:p-6 flex items-center justify-center">
        <div id="canvas-container" class="relative" style="max-width:100%; touch-action: pan-x pan-y;">
          <!-- SVG injected here -->
        </div>
      </div>
      <!-- Zoom controls — below the keyboard, centered -->
      <div class="flex-shrink-0 flex items-center justify-center gap-2 py-2 border-t border-border bg-paper">
        <button id="zoom-out" class="w-9 h-9 rounded-md hover:bg-surface active:bg-border text-ink flex items-center justify-center text-xl font-semibold border border-border" title="Zoom out">−</button>
        <button id="zoom-reset" class="px-3 h-9 rounded-md hover:bg-surface active:bg-border text-ink flex items-center justify-center text-xs font-mono border border-border min-w-[60px]" title="Reset zoom (100%)"><span id="zoom-label">100%</span></button>
        <button id="zoom-in" class="w-9 h-9 rounded-md hover:bg-surface active:bg-border text-ink flex items-center justify-center text-xl font-semibold border border-border" title="Zoom in">＋</button>
      </div>
    </main>
  `;

  const container = root.querySelector<HTMLElement>('#canvas-container')!;
  const scrollArea = root.querySelector<HTMLElement>('.flex-1.overflow-auto')!;
  const zoomInBtn = root.querySelector<HTMLButtonElement>('#zoom-in')!;
  const zoomOutBtn = root.querySelector<HTMLButtonElement>('#zoom-out')!;
  const zoomResetBtn = root.querySelector<HTMLButtonElement>('#zoom-reset')!;
  const zoomLabel = root.querySelector<HTMLElement>('#zoom-label')!;

  // ─── Zoom state ────────────────────────────────────────────────────────
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 3.0;
  const ZOOM_STEP = 0.1;  // 10% per click
  let zoom = 1.0;

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

  // ─── Ctrl+wheel zoom (desktop) ─────────────────────────────────────────
  scrollArea.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setZoom(zoom + delta);
    }
  }, { passive: false });

  // ─── Touch pinch-to-zoom (two fingers only) ────────────────────────────
  // Panning is handled natively by the browser via touch-action: pan-x pan-y
  // on the container. We only intercept two-finger gestures for pinch zoom.
  let pinchStart: { dist: number; zoom: number } | null = null;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      // Two-finger pinch — intercept
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStart = { dist, zoom };
    }
    // One-finger touch: let the browser handle native panning (do nothing)
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (pinchStart && e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / pinchStart.dist;
      setZoom(pinchStart.zoom * ratio);
    }
    // One-finger move: let browser pan natively (do nothing)
  }, { passive: false });

  container.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      pinchStart = null;
    }
  });

  // ─── Render ────────────────────────────────────────────────────────────
  function rerender() {
    const layout = getLayout(store.design.layout);
    // Available width = scroll area client width minus padding; min 280px
    const availW = Math.max(280, scrollArea.clientWidth - 24);
    // Render at scale=1 to get natural dimensions
    const { svg, width } = renderKeyboardSVG(layout, store.design.keycaps, {
      selectedKeyIds: store.selectedKeyIds,
      scale: 1,
    });
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
