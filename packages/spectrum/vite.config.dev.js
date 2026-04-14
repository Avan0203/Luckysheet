// vite.config.dev.js - 用于开发示例的配置
import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: './example',  // 设置example为根目录
  server: {
    port: 3000,
    open: '/esm-test.html',  // 默认打开ESM测试页面
    fs: {
      // 允许访问项目根目录外的文件
      allow: ['..']
    },
    // 配置中间件来处理静态资源请求
    middlewareMode: false,
    configureServer(server) {
      // 处理对上级目录文件的请求
      server.middlewares.use((req, res, next) => {
        const url = req.url.replace(/^\//, '');
        let fullPath = null;
        
        // 处理特定的静态资源路径
        if (url === 'spectrum.css' || url === 'spectrum-colorpicker.css') {
          // /spectrum.css -> ../dist/spectrum-colorpicker.css
          fullPath = resolve(__dirname, 'dist', 'spectrum-colorpicker.css');
        } else if (url.startsWith('i18n/')) {
          // /i18n/* -> ../dist/i18n/*
          fullPath = resolve(__dirname, 'dist', url);
        } else if (url.startsWith('dist/')) {
          // /dist/* -> ../dist/*
          fullPath = resolve(__dirname, '..', url);
        } else if (url.includes('..')) {
          // 处理包含 .. 的路径
          fullPath = resolve(__dirname, url);
        }
        
        // 检查文件是否存在并提供服务
        if (fullPath && fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          // 根据文件扩展名设置 Content-Type
          const ext = fullPath.split('.').pop().toLowerCase();
          const contentTypes = {
            'js': 'application/javascript',
            'css': 'text/css',
            'html': 'text/html',
            'json': 'application/json'
          };
          res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
          res.end(fs.readFileSync(fullPath));
          return;
        }
        next();
      });
    }
  },
  build: {
    outDir: '../dist-example',  // 构建输出到不同目录，避免与库构建冲突
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // 确保正确解析jquery
      'jquery': 'jquery'
    }
  },
  optimizeDeps: {
    include: ['jquery']  // 预优化jQuery依赖
  },
  // 配置公共资源路径
  publicDir: false,  // 禁用默认的public目录
});
