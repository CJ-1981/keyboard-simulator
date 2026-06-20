import { defineConfig } from 'vite';

// NOTE: when deploying to https://<user>.github.io/keyboard-lab/,
// set base to '/keyboard-lab/'. For local dev or custom domain, use '/'.
export default defineConfig({
  base: './',  // relative paths — works for both GH Pages subpath and local
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'idb': ['idb'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
