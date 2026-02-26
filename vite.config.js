import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const pkg = createRequire(import.meta.url)('./package.json');

// 将 luckysheet 源码中的全局 $ 替换为 window.$（Vite define 对 $ 有 bug）
function replaceJqueryGlobal() {
  return {
    name: 'replace-jquery-global',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('node_modules') && (id.includes('src/') || id.includes('src\\'))) {
        const win$ = 'window.' + '\x24'; // window.$ 避免 replace 中 $ 被转义
        // 负向后顾：排除 window.$. 和 $$（util.js 的 $$ 函数）
        return {
          code: code
            .replace(/(?<!window\.)(?<!\$)\$\./g, win$ + '.')
            .replace(/(?<!window\.)(?<!\$)\$\(/g, win$ + '('),
          map: null,
        };
      }
      return null;
    },
  };
}
const banner = `/*! @preserve
 * ${pkg.name}
 * version: ${pkg.version}
 * https://github.com/mengshukeji/Luckysheet
 */`;

const root = resolve(process.cwd());

export default defineConfig({
  // public 目录：publicDir 会原样复制到 dist 根目录，运行时通过根路径访问，如 /locale/en.js、/plugins/images/xxx.png
  publicDir: 'public',
  resolve: {
    alias: {
      // 构建时解析 public 下模块（如 locale），支持 import from 'public/xxx'
      public: resolve(root, 'public'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'luckysheet',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'luckysheet.esm.js' : 'luckysheet.umd.js'),
    },
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      // jQuery、spectrum、uuid 等全部打包进 luckysheet.esm.js，不 external
      external: [],
      output: {
        banner,
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith('.css') ? 'luckysheet.css' : 'assets/[name]-[hash][extname]',
      },
    },
    target: 'es2015',
  },
  plugins: [
    replaceJqueryGlobal(),
    viteStaticCopy({
      targets: [
        {
          src: [
            'src/expendPlugins/**/*',
            '!**/plugin.js',
            '!**/chartmix.umd.min.js',
            '!**/chartmix.umd.min.js.map',
          ],
          dest: 'expendPlugins',
          structured: true,
        },
        // chartmix 已从 package 引入，不再复制；chartmix.css 仍从 src 复制供运行时 loadLinks
        // 静态资源已归类到 public/（plugins/images、css、assets/iconfont），由 publicDir 复制到 dist
      ],
    }),
    // 从 JS 源码（allowJs + JSDoc）自动生成 .d.ts；rollupTypes: false 保留入口的 default export（luckysheet）
    dts({
      tsconfigPath: './tsconfig.build.json',
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
});
