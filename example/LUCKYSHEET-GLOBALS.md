# 在其它项目中使用 Luckysheet（dist 包）

当你在另一个项目中通过 `import luckysheet from 'luckysheet'` 使用打包后的 dist 时，Luckysheet 依赖这些**全局变量**：`window.$` / `window.jQuery`、jQuery 上的 `.mousewheel`、`window.uuid`、`window.Clipboard`、`window.html2canvas`、`window.localforage`、`window.jStat`，以及 Spectrum、jQuery UI 等。

若未在**加载 Luckysheet 之前**挂好这些全局，会报错，例如：`TypeError: $(...).mousewheel is not a function`。

## 做法（与 example 一致）

1. **复制并保留入口顺序**  
   将本 example 的 `src/setup-globals.ts`、`src/spectrum-load.ts` 复制到你的项目（或按同样逻辑实现）。

2. **入口文件第一行必须挂全局**  
   在你的**入口文件**（如 `main.ts` / `main.js`）里，**第一行**就要导入“挂全局”的模块，再导入其它内容。否则打包后可能先执行到 Luckysheet，再执行 setup-globals，就会报 `.mousewheel is not a function`。

   ```ts
   // 正确：第一行就是挂全局
   import './setup-globals'
   import './spectrum-load'

   import './assets/main.css'
   import { createApp } from 'vue'
   import App from './App.vue'
   createApp(App).mount('#app')
   ```

   ```ts
   // 错误：先 import 了会间接加载 luckysheet 的模块，再 import setup-globals 太晚
   import { createApp } from 'vue'
   import App from './App.vue'
   import './setup-globals'  // 太晚，Luckysheet 可能已执行
   ```

3. **依赖**  
   在项目 `package.json` 中安装与 example 相同的依赖，例如：`jquery`、`jquery-mousewheel`、`spectrum-colorpicker`、`uuid` 等（参见 `example/package.json`）。

4. **mousewheel 工厂**  
   `jquery-mousewheel` 在 ESM 下是工厂函数，必须在 setup-globals 里用当前的 `$` 调用一次，才能给 `$.fn` 挂上 `.mousewheel`。若仍报 `mousewheel is not a function`，检查是否对工厂做了 `(m?.default ?? m)($)` 这类兼容（见 `setup-globals.ts`）。

## Webpack 项目出现 hasJQuery: false

若控制台打印 `[Luckysheet globals] { hasJQuery: false, ... }`，说明执行 setup-globals 时 `import jquery` 得到的是 undefined（或未挂到 window），常见原因和做法：

1. **jquery 被配成 external**  
   不要将 jquery 设为 externals，让 Webpack 打包进来；或改为在 **index.html 里用 `<script src="...jquery.min.js">` 先于你的 bundle 引入**，这样执行 setup-globals 时 `window.jQuery` 已存在，代码会兜底使用。

2. **入口执行顺序**  
   用**多入口**保证 setup-globals 最先执行：
   ```js
   // webpack.config.js
   entry: {
     main: ['./src/setup-globals.ts', './src/spectrum-load.ts', './src/index.ts'],
   }
   ```
   或入口文件第一行**只**写：
   ```ts
   import './setup-globals'
   import './spectrum-load'
   ```
   不要再在它们之前 import 任何会间接加载 luckysheet 的模块（如 App、router、store 里若引用了含 luckysheet 的页面，也可能被提前解析）。

3. **确认依赖**  
   `pnpm add jquery jquery-mousewheel spectrum-colorpicker uuid`（或 npm/yarn），并确认没有把 jquery 从 bundle 里排除掉。

## Webpack 下 mousewheel 为 {}、hasMousewheel: false

若控制台打印 `mousewheel: {}`、`mousewheelFn: {}`、`hasMousewheel: false`，说明在你的 Webpack 里 `import mousewheel from 'jquery-mousewheel'` 被解析成空对象，没有拿到工厂函数。

1. **用 require 兜底**  
   当前 `setup-globals.ts` 已加逻辑：当 import 得到非函数时，会尝试 `require('jquery-mousewheel')` 并调用工厂。请用最新版 setup-globals 再试。

2. **用 script 标签兜底**  
   若 require 仍拿不到，可在 **index.html** 里在 jQuery 之后、你的 bundle 之前加上：
   ```html
   <script src="https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/jquery-mousewheel@3.2.2/jquery.mousewheel.min.js"></script>
   ```
   或使用本地的 `node_modules/jquery-mousewheel/jquery.mousewheel.min.js`。UMD 会在执行时把 `.mousewheel` 挂到 `window.jQuery.fn` 上，setup-globals 里已设置的 `window.$ = window.jQuery = $` 会与之一致。
