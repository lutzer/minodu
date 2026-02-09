import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		proxy: {
			'/api/services': {
				target: 'http://localhost',
				changeOrigin: true
			},
			'/api/forum': {
				target: 'http://localhost',
				changeOrigin: true
			},
			'/api/backend': {
				target: 'http://localhost',
				changeOrigin: true
			}
		}
	}
});
