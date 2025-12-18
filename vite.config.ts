import react from '@vitejs/plugin-react';
import macros from 'unplugin-parcel-macros';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		tsConfigPaths(),
		macros.vite(),
	],
	// https://github.com/adobe/react-spectrum/blob/main/examples/s2-vite-project/vite.config.ts
	build: {
		target: ['es2022'],
		// Lightning CSS produces much a smaller CSS bundle than the default minifier.
		cssMinify: 'lightningcss',
		rollupOptions: {
			output: {
				// Bundle all S2 and style-macro generated CSS into a single bundle instead of code splitting.
				// Because atomic CSS has so much overlap between components, loading all CSS up front results in
				// smaller bundles instead of producing duplication between pages.
				manualChunks(id) {
					if (/macro-(.*)\.css$/.test(id) || /@react-spectrum\/s2\/.*\.css$/.test(id)) {
						return 's2-styles';
					}
				},
			},
		},
	},
});
