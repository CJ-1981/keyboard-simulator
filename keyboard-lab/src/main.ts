import './styles.css';
import { store } from './store/store';
import { renderToolbar } from './components/Toolbar';
import { renderSidebar } from './components/Sidebar';
import { renderCanvas } from './components/Canvas';
import { renderInspector } from './components/Inspector';
import { renderStatusBar } from './components/StatusBar';

/**
 * Keyboard Lab — entry point.
 *
 * Wires up a responsive 3-pane Studio layout:
 *   - Desktop (≥1024px): sidebar / canvas / inspector side-by-side
 *   - Tablet (768–1023px): sidebar collapses into a slide-out drawer
 *   - Mobile (<768px): sidebar drawer + inspector bottom sheet
 *
 * A top hamburger button toggles the sidebar drawer on small screens.
 * A bottom-right FAB toggles the inspector bottom sheet on mobile.
 */
const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="flex flex-col h-full">
    <div id="toolbar"></div>
    <div class="flex flex-1 overflow-hidden relative">
      <div id="sidebar" class="sidebar-pane"></div>
      <div id="sidebar-backdrop" class="sidebar-backdrop hidden"></div>
      <div id="canvas" class="flex-1"></div>
      <div id="inspector" class="inspector-pane"></div>
    </div>
    <div id="statusbar"></div>
    <button id="inspector-fab" class="inspector-fab hidden" aria-label="Show inspector">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="10" cy="10" r="3"/>
        <path d="M10 1v3M10 16v3M1 10h3M16 10h3"/>
      </svg>
    </button>
  </div>
`;

renderToolbar(document.getElementById('toolbar')!);
renderSidebar(document.getElementById('sidebar')!);
renderCanvas(document.getElementById('canvas')!);
renderInspector(document.getElementById('inspector')!);
renderStatusBar(document.getElementById('statusbar')!);

// ─── Mobile sidebar drawer toggle ────────────────────────────────────────
const sidebar = document.getElementById('sidebar')!;
const backdrop = document.getElementById('sidebar-backdrop')!;
const inspector = document.getElementById('inspector')!;
const inspectorFab = document.getElementById('inspector-fab')!;

function openSidebar() {
  sidebar.classList.add('sidebar-open');
  backdrop.classList.remove('hidden');
}
function closeSidebar() {
  sidebar.classList.remove('sidebar-open');
  backdrop.classList.add('hidden');
}
function toggleInspector() {
  inspector.classList.toggle('inspector-open');
}

backdrop.addEventListener('click', closeSidebar);
inspectorFab.addEventListener('click', toggleInspector);

// Toolbar exposes a hamburger button on mobile — wire it via event delegation
document.addEventListener('kl:toggle-sidebar', openSidebar);

// Close drawers when switching to desktop (handles orientation change / resize)
function handleViewportChange() {
  const isDesktop = window.innerWidth >= 1024;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  if (isDesktop) {
    closeSidebar();
    inspector.classList.remove('inspector-open');
    inspectorFab.classList.add('hidden');
  } else if (isTablet) {
    inspectorFab.classList.add('hidden');
  } else {
    // Mobile — show the FAB
    inspectorFab.classList.remove('hidden');
  }
}
window.addEventListener('resize', handleViewportChange);
handleViewportChange();

// Initial render trigger — fire one notify so all components paint
store.subscribe(() => {});
void store;  // ensure store is referenced (tree-shaking safety)
