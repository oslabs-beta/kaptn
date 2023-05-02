import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    include: '**/*.{jsx,tsx}',
  })],
  base: './',
  server: {
    port: 4444,
    host: true,
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://localhost:6666',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://3.86.155.160:6666',
        changeOrigin: true,
      },
      '/prom-graf-setup': {
        target: 'http://localhost:6666',
        changeOrigin: true,
      },
    },
  },
});
