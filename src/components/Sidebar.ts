import { store } from '../store/store';
import { layoutList } from '../layouts';
import { listDesigns, deleteDesign } from '../persistence/db';
import { COLORWAY_PRESETS } from '../layouts/colorways';
import * as favorites from '../store/favorites';
import type { DesignLibraryEntry } from '../store/types';

/**
 * Left sidebar — layout picker + colorway presets (with favorites) + saved designs gallery.
 */
export function renderSidebar(root: HTMLElement) {
  root.innerHTML = `
    <aside class="bg-paper border-r border-border flex flex-col h-full w-[280px] lg:w-56 overflow-y-auto">
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
        <div class="flex gap-1 mb-2 flex-wrap">
          <button id="filter-all" class="filter-chip text-xs px-2 py-0.5 rounded-full border border-brass bg-brass text-paper">All</button>
          <button id="filter-favorites" class="filter-chip text-xs px-2 py-0.5 rounded-full border border-border text-muted hover:bg-surface flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0l1.5 3 3.5.5-2.5 2.4.6 3.4L5 8l-3.1 1.3.6-3.4L0 3.5 3.5 3z"/></svg>
            Favorites <span id="fav-count" class="text-muted/70">0</span>
          </button>
        </div>
        <input id="colorway-search" type="search" placeholder="Search colorways..." class="w-full text-xs bg-surface border border-border rounded px-2 py-1 mb-2 focus:outline-none focus:border-brass" />
        <div id="colorway-list" class="flex flex-col gap-1">
          ${COLORWAY_PRESETS.map((c) => `
            <div data-colorway-row="${c.id}" class="colorway-row flex items-center gap-1 group rounded hover:bg-surface">
              <button data-colorway="${c.id}" class="colorway-item flex-1 text-left text-sm px-2 py-1.5 text-ink" title="${escapeHtml(c.description)}">
                <div class="flex items-center gap-2">
                  <div class="flex gap-0.5 flex-shrink-0">
                    <span class="w-3 h-3 rounded-sm border border-border" style="background:${c.colors.alpha.base}"></span>
                    <span class="w-3 h-3 rounded-sm border border-border" style="background:${c.colors.mod.base}"></span>
                    <span class="w-3 h-3 rounded-sm border border-border" style="background:${c.colors.accent.base}"></span>
                  </div>
                  <span class="truncate">${escapeHtml(c.name)}</span>
                </div>
              </button>
              <button data-fav="${c.id}" class="fav-btn p-1 mr-1 rounded hover:bg-border/50 flex-shrink-0" title="Toggle favorite" aria-label="Toggle favorite">
                ${starIcon(favorites.isFavorite(c.id))}
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="p-3 border-b border-border flex-shrink-0">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-semibold text-muted uppercase tracking-wider">My Designs</div>
          <button id="btn-refresh-gallery" class="text-xs text-muted hover:text-ink" title="Refresh">⟳</button>
        </div>
        <div id="design-gallery" class="flex flex-col gap-1">
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

  // Favorite toggle buttons — clicking the star does NOT apply the colorway,
  // only toggles its favorite state. Stops propagation so the click doesn't
  // bubble up to the colorway-item button underneath.
  root.querySelectorAll<HTMLButtonElement>('.fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.fav!;
      const nowFav = favorites.toggleFavorite(id);
      btn.innerHTML = starIcon(nowFav);
      applyFilters();
      updateFavCount();
    });
  });

  // Filter chip: All / Favorites
  let showOnlyFavorites = false;
  const filterAll = root.querySelector<HTMLButtonElement>('#filter-all')!;
  const filterFav = root.querySelector<HTMLButtonElement>('#filter-favorites')!;
  filterAll.addEventListener('click', () => {
    showOnlyFavorites = false;
    filterAll.classList.add('bg-brass', 'text-paper', 'border-brass');
    filterAll.classList.remove('text-muted', 'border-border', 'hover:bg-surface');
    filterFav.classList.remove('bg-brass', 'text-paper', 'border-brass');
    filterFav.classList.add('text-muted', 'border-border', 'hover:bg-surface');
    applyFilters();
  });
  filterFav.addEventListener('click', () => {
    showOnlyFavorites = true;
    filterFav.classList.add('bg-brass', 'text-paper', 'border-brass');
    filterFav.classList.remove('text-muted', 'border-border', 'hover:bg-surface');
    filterAll.classList.remove('bg-brass', 'text-paper', 'border-brass');
    filterAll.classList.add('text-muted', 'border-border', 'hover:bg-surface');
    applyFilters();
  });

  // Re-render favorite star states when favorites change elsewhere
  favorites.subscribe(() => {
    root.querySelectorAll<HTMLButtonElement>('.fav-btn').forEach((btn) => {
      const id = btn.dataset.fav!;
      btn.innerHTML = starIcon(favorites.isFavorite(id));
    });
    updateFavCount();
    applyFilters();
  });

  function updateFavCount() {
    const count = favorites.getFavorites().length;
    const el = root.querySelector<HTMLElement>('#fav-count');
    if (el) el.textContent = String(count);
  }

  // Apply both search + favorites filters together
  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    root.querySelectorAll<HTMLElement>('.colorway-row').forEach((row) => {
      const id = row.dataset.colorwayRow!;
      const btn = row.querySelector<HTMLButtonElement>('.colorway-item')!;
      const name = btn.textContent?.toLowerCase() ?? '';
      const desc = (btn.getAttribute('title') || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || desc.includes(q);
      const matchesFav = !showOnlyFavorites || favorites.isFavorite(id);
      const visible_now = matchesSearch && matchesFav;
      row.style.display = visible_now ? '' : 'none';
      if (visible_now) visible++;
    });
    countLabel.textContent = `${visible} of ${COLORWAY_PRESETS.length}`;
  }

  // Colorway search filter
  const search = root.querySelector<HTMLInputElement>('#colorway-search')!;
  const countLabel = root.querySelector<HTMLElement>('#colorway-count')!;
  search.addEventListener('input', applyFilters);

  // Initial favorite count
  updateFavCount();

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

function starIcon(filled: boolean): string {
  // 14x14 star SVG — filled (brass) when favorited, outline (muted) when not
  if (filled) {
    return `<svg width="14" height="14" viewBox="0 0 14 14" fill="#95771c" stroke="#95771c" stroke-width="1" stroke-linejoin="round"><path d="M7 1l1.85 3.76 4.15.6-3 2.92.71 4.13L7 11.43 3.29 12.4l.71-4.13L1 5.36l4.15-.6z"/></svg>`;
  }
  return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#bfb8a6" stroke-width="1.2" stroke-linejoin="round"><path d="M7 1l1.85 3.76 4.15.6-3 2.92.71 4.13L7 11.43 3.29 12.4l.71-4.13L1 5.36l4.15-.6z"/></svg>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
