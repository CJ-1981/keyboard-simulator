# Keyboard Lab

A browser-based simulator for keyboard layouts and keycap colorways. Built for mechanical-keyboard enthusiasts who want to design, visualize, and iterate on custom keyboard builds entirely in the browser — no account, no server, no cloud.

## Features

- **Three layouts at launch:** Full 108, TKL 87, 75% Compact
- **Isometric 3D keycap rendering** via SVG + CSS (no WebGL)
- **Per-key customization:** base color, legend color, legend text
- **Region presets:** bulk-paint alpha / mod / accent / numpad / space keys
- **Local persistence:** all designs stored in IndexedDB, no backend needed
- **Export:** high-resolution PNG (2× DPI) and JSON (re-importable)
- **Keyboard shortcuts:** Ctrl+S save, Ctrl+Z/Y undo/redo
- **Static-only build:** deployable to GitHub Pages or any static host

## Tech Stack

- Vanilla Vite + TypeScript (no framework runtime)
- Tailwind CSS for styling
- IndexedDB (via `idb`) for persistence
- SVG + CSS transforms for isometric 3D
- ~150KB gzipped bundle

## Local Development

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # type-check + production build to ./dist
npm run preview  # preview the production build locally
```

## Deployment

### GitHub Pages

1. Push the repo to GitHub
2. Go to **Settings → Pages → Source = GitHub Actions**
3. Push to `main` — the included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically
4. Site goes live at `https://CJ-1981.github.io/keyboard-simulator/`

If you rename the repo, update `base` in `vite.config.ts` to `'/<new-repo-name>/'`.

### Vercel / Netlify / Cloudflare Pages

Import the repo and use these settings:
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required

## Architecture

See [`docs/PRODUCT-PLAN.pdf`](../download/KeyboardLab-Product-Plan.pdf) for the full product plan including:
- Three alternative UI proposals (A — Studio, B — Compact, C — Pro Workbench)
- Technical architecture and component tree
- JSON schema and persistence model
- Four-sprint implementation roadmap

This repository implements **Proposal A — Studio**, the recommended three-pane layout.

## License

MIT
