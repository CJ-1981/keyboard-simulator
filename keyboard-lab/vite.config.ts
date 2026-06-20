import { defineConfig } from 'vite';

// NOTE: when deploying to https://<user>.github.io/<repo>/,
// set base to '/<repo>/'. For local dev or custom domain, use '/'.
export default defineConfig({
  base: '/keyboard-simulator/',  // MUST match GitHub repo name
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
