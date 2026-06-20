import { store } from '../store/store';
import { getLayout } from '../layouts';
import { renderKeyboardSVG } from '../render/KeyboardRenderer';

/**
 * Center canvas — renders the SVG keyboard and forwards clicks to the store.
 *
 * Each keycap's top-face rect carries a `data-key-id` attribute (set by the
 * renderer). We attach a single delegated click listener on the SVG container
 * instead of one listener per key — cleaner and faster on the 108-key layout.
 */
export function renderCanvas(root: HTMLElement) {
  root.innerHTML = `
    <main class="flex-1 overflow-auto bg-paper p-6 flex items-center justify-center">
      <div id="canvas-container" class="relative">
        <!-- SVG injected here -->
      </div>
    </main>
  `;

  const container = root.querySelector<HTMLElement>('#canvas-container')!;

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
    const { svg, width, height } = renderKeyboardSVG(layout, store.design.keycaps, {
      selectedKeyIds: store.selectedKeyIds,
      scale: 1.2,
    });
    container.innerHTML = svg;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
  };

  rerender();
  store.subscribe(rerender);
}
