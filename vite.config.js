import { defineConfig } from 'vite';
import { createRequire } from 'node:module';
const pkg = createRequire(import.meta.url)('./package.json');
const banner = `/*! @preserve
 * ${pkg.name}
 * version: ${pkg.version}
 * https://github.com/mengshukeji/Luckysheet
 */`;

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'luckysheet',
      formats: ['es'],
      fileName: () => 'luckysheet.esm.js',
    },
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        banner,
      },
    },
    target: 'es2015',
  },
});
