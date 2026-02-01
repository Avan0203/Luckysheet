import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/**
 * 单独构建 plugins 包：将 jQuery、uuid、clipboard、spectrum、jquery-ui、html2canvas、
 * localforage、jStat、sPage 等打成 IIFE，输出 dist/plugins/js/plugin.js，供 index.html 在主包前加载。
 * 静态资源由主构建 publicDir 复制到 dist 根目录，此处不复制 public，避免 dist/plugins/js/ 下重复。
 */
export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      public: resolve(__dirname, 'public'),
    },
  },
  build: {
    emptyOutDir: false,
    lib: false,
    outDir: 'dist/plugins/js',
    rollupOptions: {
      input: resolve(__dirname, 'src/plugins-entry.js'),
      output: {
        entryFileNames: 'plugin.js',
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2015',
  },
});
