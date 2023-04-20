import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
    },
  },
});
