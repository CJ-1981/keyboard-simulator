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
 * Wires up the 3-pane Studio layout (sidebar / canvas / inspector) with a
 * top toolbar and a slim bottom status bar.
 */
const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="flex flex-col h-full">
    <div id="toolbar"></div>
    <div class="flex flex-1 overflow-hidden">
      <div id="sidebar"></div>
      <div id="canvas" class="flex-1"></div>
      <div id="inspector"></div>
    </div>
    <div id="statusbar"></div>
  </div>
`;

renderToolbar(document.getElementById('toolbar')!);
renderSidebar(document.getElementById('sidebar')!);
renderCanvas(document.getElementById('canvas')!);
renderInspector(document.getElementById('inspector')!);
renderStatusBar(document.getElementById('statusbar')!);

// Initial render trigger — fire one notify so all components paint
store.subscribe(() => {});
void store;  // ensure store is referenced (tree-shaking safety)
