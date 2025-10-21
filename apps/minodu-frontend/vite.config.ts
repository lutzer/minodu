import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/api/services': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/forum': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  }
});