import { store } from '../store/store';
import { getLayout } from '../layouts';

/**
 * Bottom status bar — layout name, key count, save status, last saved time.
 */
export function renderStatusBar(root: HTMLElement) {
  root.innerHTML = `
    <footer class="h-7 bg-paper border-t border-border flex items-center px-3 sm:px-4 text-xs text-muted gap-2 sm:gap-4 overflow-hidden">
      <span id="status-layout" class="truncate flex-shrink-0"></span>
      <span class="hidden sm:inline">·</span>
      <span id="status-count" class="hidden sm:inline"></span>
      <span class="hidden sm:inline">·</span>
      <span id="status-selection" class="truncate flex-1 min-w-0">No selection</span>
      <span id="status-saved" class="truncate flex-shrink-0">Unsaved changes</span>
    </footer>
  `;

  const layoutEl = root.querySelector<HTMLElement>('#status-layout')!;
  const countEl = root.querySelector<HTMLElement>('#status-count')!;
  const selEl = root.querySelector<HTMLElement>('#status-selection')!;
  const savedEl = root.querySelector<HTMLElement>('#status-saved')!;

  store.subscribe(() => {
    const layout = getLayout(store.design.layout);
    layoutEl.textContent = `Layout: ${layout.name}`;
    countEl.textContent = `${layout.keys.length} keys`;
    const n = store.selectedKeyIds.length;
    selEl.textContent = n === 0 ? 'No selection' : `${n} key${n === 1 ? '' : 's'} selected`;

    if (store.isDirty) {
      savedEl.textContent = '● Unsaved changes';
      savedEl.className = 'text-orange-600';
    } else if (store.lastSavedAt) {
      const t = new Date(store.lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      savedEl.textContent = `✓ Saved ${t}`;
      savedEl.className = 'text-green-700';
    } else {
      savedEl.textContent = 'Not yet saved';
      savedEl.className = 'text-muted';
    }
  });
}
