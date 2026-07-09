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
  },
});
