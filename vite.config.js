import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this app from a repository subpath; Vite's dev server
  // serves it from the origin root.
  base: command === 'build' ? '/Telegram-Chat-Export-Reader/' : '/',
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}));
