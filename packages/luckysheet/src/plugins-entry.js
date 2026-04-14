/**
 * Plugins 打包入口：依赖挂到 window，供 luckysheet 主包使用（script 顺序加载）。
 * 由 vite.plugins.config.js 打成 dist/plugins/js/plugin.js (IIFE)。
 */
import './plugins-jquery-global.js';


// jQuery 插件（依赖已挂好的 window.jQuery），打包进 luckysheet.esm.js
import 'spectrum-colorpicker';
import './js/jquery-ui.js';
import './js/jquery.mousewheel.js';
import './js/jquery.sPage.esm.js';
