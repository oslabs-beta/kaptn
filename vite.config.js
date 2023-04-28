import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 4444,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:6666',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:6666',
        changeOrigin: true,
      },
      '/prom-graf-setup': {
        target: 'http://localhost:6666',
        changeOrigin: true,
      },
    },
  },
});
