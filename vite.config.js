import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const SERVER = 'http://localhost:3000/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333
  }
})
