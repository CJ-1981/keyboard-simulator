import type { LayoutId } from '../store/types';
import { layoutList } from '../layouts';
import { store } from '../store/store';
import {
  exportDesignToJSON,
  exportDesignToPNG,
  importDesignFromJSON,
  downloadBlob,
  sanitizeFilename,
} from '../export';

/**
 * Top toolbar — layout picker, design menu, export menu, undo/redo, save.
 */
export function renderToolbar(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex items-center gap-2 px-3 sm:px-4 h-12 bg-paper border-b border-border overflow-x-auto">
      <button id="btn-menu" class="lg:hidden p-1.5 rounded hover:bg-surface text-ink flex-shrink-0" aria-label="Toggle menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 5h14M3 10h14M3 15h14"/>
        </svg>
      </button>

      <div class="flex items-center gap-2 mr-3 flex-shrink-0">
        <div class="w-7 h-7 rounded-md bg-ink flex items-center justify-center">
          <span class="text-paper font-mono font-bold text-xs">KL</span>
        </div>
        <span class="font-semibold text-ink hidden sm:inline">Keyboard Lab</span>
      </div>

      <div class="flex items-center gap-1 flex-shrink-0">
        <label class="text-xs text-muted toolbar-section-label">Layout</label>
        <select id="layout-select" class="text-sm bg-surface border border-border rounded px-2 py-1 hover:bg-border max-w-[120px] sm:max-w-none">
          ${layoutList.map((l) => `<option value="${l.id}">${l.name}</option>`).join('')}
        </select>
      </div>

      <div class="w-px h-6 bg-border mx-1 sm:mx-2 flex-shrink-0"></div>

      <button id="btn-new" class="text-sm px-2 sm:px-3 py-1 rounded hover:bg-surface text-ink flex-shrink-0" title="New design">
        <span class="toolbar-text">New</span>
        <span class="sm:hidden">＋</span>
      </button>
      <button id="btn-save" class="text-sm px-2 sm:px-3 py-1 rounded bg-brass text-paper hover:opacity-90 flex-shrink-0" title="Save (Ctrl+S)">
        Save
      </button>
      <button id="btn-save-as" class="text-sm px-3 py-1 rounded hover:bg-surface text-ink hidden md:block flex-shrink-0" title="Save as copy">Save As</button>

      <div class="w-px h-6 bg-border mx-1 sm:mx-2 flex-shrink-0"></div>

      <button id="btn-undo" class="text-sm px-2 py-1 rounded hover:bg-surface text-ink disabled:opacity-40 flex-shrink-0" title="Undo (Ctrl+Z)">↶</button>
      <button id="btn-redo" class="text-sm px-2 py-1 rounded hover:bg-surface text-ink disabled:opacity-40 flex-shrink-0" title="Redo (Ctrl+Y)">↷</button>

      <div class="flex-1 min-w-0"></div>

      <button id="btn-import" class="text-sm px-2 sm:px-3 py-1 rounded hover:bg-surface text-ink flex-shrink-0" title="Import JSON">
        <span class="toolbar-text">Import</span>
        <span class="sm:hidden">↥</span>
      </button>
      <button id="btn-export-json" class="text-sm px-2 sm:px-3 py-1 rounded hover:bg-surface text-ink hidden sm:block flex-shrink-0" title="Export JSON">JSON</button>
      <button id="btn-export-png" class="text-sm px-2 sm:px-3 py-1 rounded bg-ink text-paper hover:opacity-90 flex-shrink-0" title="Export PNG">PNG</button>
      <input type="file" id="import-file" accept=".json,application/json" class="hidden" />
    </div>
  `;

  // Mobile hamburger → opens sidebar drawer (event picked up by main.ts)
  root.querySelector<HTMLButtonElement>('#btn-menu')!.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('kl:toggle-sidebar'));
  });

  const layoutSelect = root.querySelector<HTMLSelectElement>('#layout-select')!;
  layoutSelect.value = store.design.layout;
  layoutSelect.addEventListener('change', () => {
    store.setLayout(layoutSelect.value as LayoutId);
  });

  root.querySelector<HTMLButtonElement>('#btn-new')!.addEventListener('click', () => {
    if (confirm('Start a new design? Unsaved changes will be lost.')) {
      store.newDesign();
    }
  });

  root.querySelector<HTMLButtonElement>('#btn-save')!.addEventListener('click', () => {
    openSaveModal();
  });

  root.querySelector<HTMLButtonElement>('#btn-save-as')!.addEventListener('click', () => {
    // Force a new id by creating a copy
    store.design.id = crypto.randomUUID();
    store.design.name = store.design.name + ' (copy)';
    openSaveModal();
  });

  const btnUndo = root.querySelector<HTMLButtonElement>('#btn-undo')!;
  btnUndo.addEventListener('click', () => store.undo());

  const btnRedo = root.querySelector<HTMLButtonElement>('#btn-redo')!;
  btnRedo.addEventListener('click', () => store.redo());

  root.querySelector<HTMLButtonElement>('#btn-import')!.addEventListener('click', () => {
    root.querySelector<HTMLInputElement>('#import-file')!.click();
  });

  const fileInput = root.querySelector<HTMLInputElement>('#import-file')!;
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const design = importDesignFromJSON(text);
      await store.save(design.name, design.description);
      await store.loadDesign(design.id);
      store.loadDesignObject(design);
    } catch (e) {
      alert('Import failed: ' + (e as Error).message);
    }
    fileInput.value = '';
  });

  root.querySelector<HTMLButtonElement>('#btn-export-json')!.addEventListener('click', async () => {
    const json = exportDesignToJSON(store.design);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `${sanitizeFilename(store.design.name)}.kbd.json`);
  });

  root.querySelector<HTMLButtonElement>('#btn-export-png')!.addEventListener('click', async () => {
    try {
      const blob = await exportDesignToPNG(store.design);
      downloadBlob(blob, `${sanitizeFilename(store.design.name)}.png`);
    } catch (e) {
      alert('PNG export failed: ' + (e as Error).message);
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const meta = e.ctrlKey || e.metaKey;
    if (meta && e.key === 's' && !e.shiftKey) {
      e.preventDefault();
      openSaveModal();
    } else if (meta && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      store.undo();
    } else if (meta && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
      e.preventDefault();
      store.redo();
    }
  });

  // Update undo/redo button disabled state on store change
  store.subscribe(() => {
    btnUndo.disabled = !store.canUndo;
    btnRedo.disabled = !store.canRedo;
    if (layoutSelect.value !== store.design.layout) {
      layoutSelect.value = store.design.layout;
    }
  });
}

function openSaveModal() {
  const existing = document.getElementById('save-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'save-modal';
  modal.className = 'fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4';
  modal.innerHTML = `
    <div class="bg-paper rounded-t-lg sm:rounded-lg shadow-xl w-full sm:w-96 p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
      <h2 class="text-lg font-semibold text-ink mb-4">Save Design</h2>
      <label class="block text-xs text-muted mb-1">Name</label>
      <input id="save-name" type="text" class="w-full border border-border rounded px-3 py-2 mb-3 text-sm" value="${escapeHtml(store.design.name)}" maxlength="80" />
      <label class="block text-xs text-muted mb-1">Description (optional)</label>
      <textarea id="save-desc" class="w-full border border-border rounded px-3 py-2 mb-4 text-sm" rows="3" maxlength="500">${escapeHtml(store.design.description)}</textarea>
      <div class="flex justify-end gap-2">
        <button id="save-cancel" class="text-sm px-3 py-1.5 rounded hover:bg-surface text-ink">Cancel</button>
        <button id="save-confirm" class="text-sm px-4 py-1.5 rounded bg-brass text-paper hover:opacity-90">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const nameInput = modal.querySelector<HTMLInputElement>('#save-name')!;
  const descInput = modal.querySelector<HTMLTextAreaElement>('#save-desc')!;
  nameInput.focus();
  nameInput.select();

  modal.querySelector<HTMLButtonElement>('#save-cancel')!.addEventListener('click', () => modal.remove());
  modal.querySelector<HTMLButtonElement>('#save-confirm')!.addEventListener('click', async () => {
    await store.save(nameInput.value.trim() || 'Untitled', descInput.value.trim());
    modal.remove();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
