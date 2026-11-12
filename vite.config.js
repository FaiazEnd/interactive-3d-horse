import { defineConfig } from 'vite';

export default defineConfig({
  base: '/interactive-3d-horse/',
  server: {
    host: true,
    port: 3000,
    open: false
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
