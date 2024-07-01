import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/pattern-helper-benedict-fox/',
	plugins: [
		preact({
			prerender: {
				enabled: false,
				renderTarget: '#app',
			},
		}),
	],
});
