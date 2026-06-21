import { store } from '../store/store';
import { getLayout } from '../layouts';
import { renderKeyboardSVG } from '../render/KeyboardRenderer';

/**
 * Center canvas — renders the SVG keyboard and forwards clicks to the store.
 *
 * Each keycap's top-face rect carries a `data-key-id` attribute (set by the
 * renderer). We attach a single delegated click listener on the SVG container
 * instead of one listener per key — cleaner and faster on the 108-key layout.
 *
 * Responsive: the SVG has a viewBox so it scales down naturally on narrow
 * viewports. The container measures the available width and sets a max-width
 * on the SVG so the keyboard always fits inside the viewport.
 */
export function renderCanvas(root: HTMLElement) {
  root.innerHTML = `
    <main class="flex-1 overflow-auto bg-paper p-3 sm:p-6 flex items-center justify-center">
      <div id="canvas-container" class="relative" style="max-width:100%;">
        <!-- SVG injected here -->
      </div>
    </main>
  `;

  const container = root.querySelector<HTMLElement>('#canvas-container')!;
  const main = root.querySelector<HTMLElement>('main')!;

  // Single delegated click handler — survives SVG re-renders without re-binding
  container.addEventListener('click', (e) => {
    const target = e.target as SVGElement;
    const keyId = target.getAttribute('data-key-id');
    if (keyId) {
      e.stopPropagation();
      store.selectKey(keyId, e.shiftKey);
    }
  });

  const rerender = () => {
    const layout = getLayout(store.design.layout);
    // Available width = main element width minus padding; min 280px
    const availW = Math.max(280, main.clientWidth - 24);
    // Render at scale=1 to get natural dimensions, then constrain via CSS
    const { svg, width } = renderKeyboardSVG(layout, store.design.keycaps, {
      selectedKeyIds: store.selectedKeyIds,
      scale: 1,
    });
    container.innerHTML = svg;
    // Cap SVG display width to available width; CSS height:auto keeps aspect ratio
    const svgEl = container.querySelector('svg');
    if (svgEl) {
      if (width > availW) {
        svgEl.style.width = `${availW}px`;
        svgEl.style.height = 'auto';
      } else {
        svgEl.style.width = `${width}px`;
        svgEl.style.height = 'auto';
      }
      svgEl.style.maxWidth = '100%';
    }
  };

  rerender();
  store.subscribe(rerender);

  // Re-render on viewport resize so the SVG scales with the container
  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rerender, 100);
  });
}
