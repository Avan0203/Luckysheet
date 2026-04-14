import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'spectrum.esm.js'),
      name: 'spectrum',
      formats: ['es'],
      fileName: (format) => 'spectrum.esm.js',
    },
    rollupOptions: {
      // jQuery 作为 external 依赖,由使用方提供
      external: ['jquery'],
      output: {
        globals: {
          jquery: '$',
        },
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2015',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'i18n',
          dest: '.',
        },
      ],
    }),
  ],
});
