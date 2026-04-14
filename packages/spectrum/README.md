# Spectrum Colorpicker
## The No Hassle jQuery Colorpicker (ESM Version)

> **注意**: 这是 Spectrum 的 ESM 改造版本，专为现代前端项目设计。

### 📖 原始项目

- **原作者**: Brian Grinstead
- **原仓库**: https://github.com/bgrins/spectrum
- **原文档**: http://bgrins.github.io/spectrum
- **许可证**: MIT

Spectrum 是一个轻量级、高度可定制的 jQuery 颜色选择器插件。它不需要图片资源，提供了简洁的 API，支持多种颜色格式和国际化。

---

## 🔄 本版本的改动点

### 1. ESM 模块化改造

将原始的 UMD 格式转换为 ES Module 格式，使其能够更好地与现代构建工具（Vite、Webpack、Rollup 等）集成。

**主要变化：**
- ✅ 添加了 `spectrum.esm.js` 作为 ESM 入口文件
- ✅ 使用 Vite 进行打包构建
- ✅ jQuery 作为 peer dependency，由使用方提供
- ✅ 保留了完整的 UMD 兼容性

### 2. 构建系统升级

从 Grunt 迁移到 Vite，提供更快的构建速度和更好的开发体验。

**构建配置：**
```javascript
// vite.config.js
export default defineConfig({
  build: {
    lib: {
      entry: 'spectrum.esm.js',
      formats: ['es'],
      fileName: 'spectrum.esm.js'
    },
    rollupOptions: {
      external: ['jquery']
    }
  }
});
```

### 3. 静态资源管理

使用 `vite-plugin-static-copy` 自动复制 CSS 和 i18n 文件到 dist 目录。

**打包产物：**
```
dist/
├── spectrum.esm.js          # 主文件 (40KB)
├── spectrum.esm.js.map      # Source map
├── spectrum-colorpicker.css # 样式文件 (11KB)
└── i18n/                    # 国际化文件
    ├── jquery.spectrum-en.js
    ├── jquery.spectrum-zh-cn.js
    └── jquery.spectrum-zh-tw.js
```

### 4. 多语言支持增强

改进了国际化机制，支持运行时动态切换语言。

**支持的语言：**
- English (en) - 默认
- 简体中文 (zh-cn)
- 繁體中文 (zh-tw)

---

## 🚀 使用方式

### 安装

```bash
npm install spectrum-colorpicker
# 或
pnpm add spectrum-colorpicker
```

### 基础用法

#### 方法一：ESM 导入（推荐）

```javascript
import $ from 'jquery';
import 'spectrum-colorpicker/dist/spectrum-colorpicker.css';

// 先设置全局 jQuery（必需）
window.$ = $;
window.jQuery = $;

// 然后导入 spectrum
import spectrum from 'spectrum-colorpicker';

// 使用
$('#colorpicker').spectrum({
    color: '#f00'
});
```

#### 方法二：在 HTML 中预加载 jQuery

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="node_modules/spectrum-colorpicker/dist/spectrum-colorpicker.css">
</head>
<body>
    <input id="colorpicker" />
    
    <!-- 先设置全局 jQuery -->
    <script type="module">
        import $ from 'jquery';
        window.$ = $;
        window.jQuery = $;
    </script>
    
    <!-- 再导入 spectrum -->
    <script type="module">
        import spectrum from 'spectrum-colorpicker';
        $('#colorpicker').spectrum({
            color: '#f00'
        });
    </script>
</body>
</html>
```

### 多语言使用

```javascript
import 'spectrum-colorpicker/dist/i18n/jquery.spectrum-zh-cn.js';

// 获取语言配置
const langConfig = $.spectrum.localization['zh-cn'];

// 创建实例时传入语言配置
$('#colorpicker').spectrum({
    ...langConfig,
    color: '#f00'
});
```

### 完整配置示例

```javascript
$('#full').spectrum({
    color: '#ECC',
    flat: true,                    // 平面模式
    showInput: true,               // 显示输入框
    showInitial: true,             // 显示初始颜色
    showPalette: true,             // 显示调色板
    showSelectionPalette: true,    // 显示选择历史
    maxPaletteSize: 10,            // 最大历史数量
    preferredFormat: 'hex',        // 首选格式
    localStorageKey: 'spectrum.demo', // 本地存储键
    
    // 回调函数
    move: function(color) {
        console.log('移动:', color.toHexString());
    },
    change: function(color) {
        console.log('改变:', color.toHexString());
    },
    show: function() {
        console.log('显示');
    },
    hide: function(color) {
        console.log('隐藏');
    },
    
    // 调色板
    palette: [
        ['#000', '#fff', '#f00', '#0f0', '#00f'],
        ['#ff0', '#0ff', '#f0f', '#888', '#ccc']
    ]
});
```

---

## 🛠️ 开发指南

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 测试案例

项目提供了完整的测试案例：

```bash
# 启动开发服务器后访问
http://localhost:3000/esm-test.html
```

**测试功能：**
- ✅ 基本用法测试
- ✅ 透明度支持
- ✅ 自定义调色板
- ✅ 平面模式
- ✅ 多语言切换
- ✅ 基准测试案例（完整功能演示）

### 项目结构

```
packages/spectrum/
├── spectrum.js              # 原始 UMD 文件
├── spectrum.esm.js          # ESM 包装器
├── spectrum.css             # 样式文件
├── vite.config.js           # Vite 构建配置
├── vite.config.dev.js       # 开发服务器配置
├── package.json             # 包配置
├── dist/                    # 构建产物
│   ├── spectrum.esm.js
│   ├── spectrum-colorpicker.css
│   └── i18n/
├── example/                 # 测试案例
│   ├── esm-test.html        # ESM 测试
│   ├── esm-test.js
│   ├── index.html           # 原始案例
│   └── testcase.html        # 基准测试
└── i18n/                    # 国际化文件
    ├── jquery.spectrum-en.js
    ├── jquery.spectrum-zh-cn.js
    └── jquery.spectrum-zh-tw.js
```

---

## ⚠️ 注意事项

### 1. jQuery 全局变量

由于 spectrum.js 使用 UMD 格式，需要在导入前设置全局 jQuery：

```javascript
import $ from 'jquery';
window.$ = $;
window.jQuery = $;

import spectrum from 'spectrum-colorpicker';
```

### 2. CSS 文件需要单独引入

打包产物不包含 CSS，需要手动引入：

```javascript
import 'spectrum-colorpicker/dist/spectrum-colorpicker.css';
```

### 3. 语言文件按需导入

不要一次性导入所有语言文件，根据需要导入：

```javascript
// 只导入需要的语言
import 'spectrum-colorpicker/dist/i18n/jquery.spectrum-zh-cn.js';
```

### 4. IIFE 形式的 i18n 文件

语言文件是立即执行函数，导入时会立即注册到 `$.spectrum.localization`。最后导入的语言会修改全局默认值，建议使用时显式传入语言配置。

---

## 📚 原始文档

更多详细信息请参考原始文档：
- **Demo & Docs**: http://bgrins.github.io/spectrum
- **GitHub**: https://github.com/bgrins/spectrum
- **CDN**: https://cdnjs.com/libraries/spectrum

### 原始安装方式

#### npm
```bash
npm install spectrum-colorpicker
```

#### Bower
```bash
bower install spectrum
```

#### CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css">
```

---

## 🌍 国际化

如果您能将 UI 文本翻译成其他语言，欢迎贡献！

**现有语言：**
- English (en)
- 简体中文 (zh-cn)
- 繁體中文 (zh-tw)

**添加新语言：**
1. 复制 `i18n/jquery.spectrum-en.js`
2. 翻译文本
3. 提交 Pull Request 或 Issue

示例参考：[荷兰语翻译](i18n/jquery.spectrum-nl.js)

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

感谢 Brian Grinstead 创建了这个优秀的颜色选择器插件，以及所有为 Spectrum 做出贡献的开发者们。

本 ESM 版本旨在让 Spectrum 更好地融入现代前端开发生态，同时保持与原始版本的兼容性。
