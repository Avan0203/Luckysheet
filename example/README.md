# Luckysheet Example

基于 Vue 3 + Vite 的 Luckysheet 示例，使用**根项目打包后的 dist** 作为依赖。

## 使用步骤

### 1. 先构建库

在**项目根目录**执行：

```bash
cd ..   # 回到 Luckysheet 根目录
pnpm build
```

会生成 `dist/luckysheet.esm.js`、`dist/luckysheet.css`、`dist/plugins/js/plugin.js` 等。

### 2. 安装 example 依赖

在 example 目录下：

```bash
pnpm install
```

`package.json` 中 `"luckysheet": "file:../"` 会链接到根目录，安装后使用的是根目录的 `dist`（见根目录 `package.json` 的 `main`/`module`）。

### 3. 启动或打包 example

```bash
pnpm dev        # 开发
pnpm run build  # 打包
pnpm preview    # 预览打包结果
```

## 关键点

- **入口顺序**：`main.ts` 第一行是 `import './spectrum-load'`，会先执行 `setup-globals`（挂 `window.$`、`.mousewheel`、`uuid` 等），再加载其他模块，否则会报 `$(...).mousewheel is not a function`。
- **样式**：在组件里 `import 'luckysheet/dist/luckysheet.css'`。
- **API**：`import luckysheet from 'luckysheet'` 后使用 `luckysheet.create()`、`luckysheet.getAllSheets()` 等。

详见 [LUCKYSHEET-GLOBALS.md](./LUCKYSHEET-GLOBALS.md)（在其它项目中使用 dist 包时的全局依赖说明）。
