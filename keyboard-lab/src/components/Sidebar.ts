import { store } from '../store/store';
import { layoutList } from '../layouts';
import { listDesigns, deleteDesign } from '../persistence/db';
import { COLORWAY_PRESETS } from '../layouts/colorways';
import type { DesignLibraryEntry } from '../store/types';

/**
 * Left sidebar — layout picker + colorway presets + saved designs gallery.
 */
export function renderSidebar(root: HTMLElement) {
  root.innerHTML = `
    <aside class="bg-paper border-r border-border flex flex-col overflow-hidden h-full w-[280px] lg:w-56">
      <div class="p-3 border-b border-border flex-shrink-0">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Layouts</div>
        <div id="layout-list" class="flex flex-col gap-1">
          ${layoutList.map((l) => `
            <button data-layout="${l.id}" class="layout-item text-left text-sm px-2 py-1.5 rounded hover:bg-surface text-ink flex items-center gap-2">
              <span class="layout-dot w-1.5 h-1.5 rounded-full bg-border"></span>
              <span>${l.name}</span>
              <span class="ml-auto text-xs text-muted">${l.keys.length} keys</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="p-3 border-b border-border flex-shrink-0">
        <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Colorways</span>
          <span class="text-muted/60 text-[10px] normal-case tracking-normal" id="colorway-count">${COLORWAY_PRESETS.length} presets</span>
        </div>
        <input id="colorway-search" type="search" placeholder="Search colorways..." class="w-full text-xs bg-surface border border-border rounded px-2 py-1 mb-2 focus:outline-none focus:border-brass" />
        <div id="colorway-list" class="flex flex-col gap-1 max-h-56 overflow-y-auto">
          ${COLORWAY_PRESETS.map((c) => `
            <button data-colorway="${c.id}" class="colorway-item text-left text-sm px-2 py-1.5 rounded hover:bg-surface text-ink group" title="${escapeHtml(c.description)}">
              <div class="flex items-center gap-2">
                <div class="flex gap-0.5 flex-shrink-0">
                  <span class="w-3 h-3 rounded-sm border border-border" style="background:${c.colors.alpha.base}"></span>
                  <span class="w-3 h-3 rounded-sm border border-border" style="background:${c.colors.mod.base}"></span>
                  <span class="w-3 h-3 rounded-sm border border-border" style="background:${c.colors.accent.base}"></span>
                </div>
                <span class="truncate">${escapeHtml(c.name)}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="flex-1 overflow-hidden flex flex-col min-h-0">
        <div class="p-3 border-b border-border flex items-center justify-between flex-shrink-0">
          <div class="text-xs font-semibold text-muted uppercase tracking-wider">My Designs</div>
          <button id="btn-refresh-gallery" class="text-xs text-muted hover:text-ink" title="Refresh">⟳</button>
        </div>
        <div id="design-gallery" class="flex-1 overflow-y-auto p-2 min-h-0">
          <div class="text-xs text-muted italic px-2 py-4 text-center">Loading...</div>
        </div>
      </div>
    </aside>
  `;

  // Layout switcher
  root.querySelectorAll<HTMLButtonElement>('.layout-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.layout as typeof layoutList[number]['id'];
      store.setLayout(id);
    });
  });

  // Colorway preset applier — click to apply to current design, shift-click to load as new
  root.querySelectorAll<HTMLButtonElement>('.colorway-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const presetId = btn.dataset.colorway!;
      const preset = COLORWAY_PRESETS.find((c) => c.id === presetId);
      if (!preset) return;
      if (e.shiftKey) {
        // Shift-click: load as new design (fresh from preset, keeps current layout)
        store.loadColorwayAsNew(preset);
      } else {
        // Plain click: apply colors to current design (keeps any custom legend edits)
        store.applyColorway(preset);
      }
    });
  });

  // Colorway search filter
  const search = root.querySelector<HTMLInputElement>('#colorway-search')!;
  const countLabel = root.querySelector<HTMLElement>('#colorway-count')!;
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    root.querySelectorAll<HTMLElement>('.colorway-item').forEach((btn) => {
      const name = btn.textContent?.toLowerCase() ?? '';
      const desc = (btn.getAttribute('title') || '').toLowerCase();
      const match = !q || name.includes(q) || desc.includes(q);
      btn.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    countLabel.textContent = `${visible} of ${COLORWAY_PRESETS.length}`;
  });

  // Refresh button
  root.querySelector<HTMLButtonElement>('#btn-refresh-gallery')!.addEventListener('click', () => {
    refreshGallery();
  });

  // Initial gallery load
  refreshGallery();

  // Re-render on store change (to highlight active layout AND refresh gallery
  // when libraryVersion bumps — happens on save/import/delete)
  let lastLibraryVersion = -1;
  let lastActiveColorway = store.activeColorwayId;
  store.subscribe(() => {
    root.querySelectorAll<HTMLButtonElement>('.layout-item').forEach((btn) => {
      const dot = btn.querySelector('.layout-dot')!;
      if (btn.dataset.layout === store.design.layout) {
        btn.classList.add('bg-surface');
        dot.classList.remove('bg-border');
        dot.classList.add('bg-brass');
      } else {
        btn.classList.remove('bg-surface');
        dot.classList.add('bg-border');
        dot.classList.remove('bg-brass');
      }
    });
    // Highlight the active colorway preset
    if (store.activeColorwayId !== lastActiveColorway) {
      lastActiveColorway = store.activeColorwayId;
      root.querySelectorAll<HTMLButtonElement>('.colorway-item').forEach((btn) => {
        if (btn.dataset.colorway === store.activeColorwayId) {
          btn.classList.add('colorway-active');
        } else {
          btn.classList.remove('colorway-active');
        }
      });
    }
    if (store.libraryVersion !== lastLibraryVersion) {
      lastLibraryVersion = store.libraryVersion;
      refreshGallery();
    }
  });
}

async function refreshGallery() {
  const container = document.getElementById('design-gallery');
  if (!container) return;

  let designs: DesignLibraryEntry[] = [];
  try {
    designs = await listDesigns();
  } catch (e) {
    container.innerHTML = `<div class="text-xs text-red-600 px-2 py-4">Storage unavailable.<br />${(e as Error).message}</div>`;
    return;
  }

  if (designs.length === 0) {
    container.innerHTML = `
      <div class="text-xs text-muted italic px-3 py-6 text-center">
        No saved designs yet.<br />Click <span class="font-semibold not-italic">Save</span> in the toolbar to create your first design.
      </div>`;
    return;
  }

  container.innerHTML = designs.map((d) => `
    <div data-id="${d.id}" class="design-card group cursor-pointer text-left px-2 py-2 rounded hover:bg-surface mb-1 border border-transparent ${d.id === store.design.id ? 'bg-surface border-border' : ''}">
      <div class="flex items-start justify-between gap-1">
        <div class="text-sm font-medium text-ink truncate flex-1">${escapeHtml(d.name)}</div>
        <button data-action="delete" data-id="${d.id}" class="opacity-0 group-hover:opacity-100 text-xs text-muted hover:text-red-600 px-1" title="Delete">×</button>
      </div>
      <div class="text-xs text-muted truncate">${escapeHtml(d.description) || '<span class="italic">No description</span>'}</div>
      <div class="text-xs text-muted mt-1 flex items-center gap-2">
        <span>${layoutLabel(d.layout)}</span>
        <span>·</span>
        <span>${formatDate(d.updatedAt)}</span>
      </div>
    </div>
  `).join('');

  container.querySelectorAll<HTMLElement>('.design-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action === 'delete') {
        const id = target.dataset.id!;
        if (confirm('Delete this design?')) {
          deleteDesign(id).then(() => refreshGallery());
        }
        return;
      }
      const id = card.dataset.id!;
      store.loadDesign(id);
    });
  });
}

function layoutLabel(id: string): string {
  const l = layoutList.find((x) => x.id === id);
  return l ? l.name : id;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diff < day && now.getDate() === d.getDate()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
