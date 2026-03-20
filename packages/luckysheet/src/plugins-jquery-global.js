/**
 * 在打包 plugins 时最先执行，将 jQuery 挂到 window，供 UMD 插件（spectrum、jquery-ui、sPage 等）使用。
 * 使用 ?umd 从 public 引入，由 vite-plugin-umd-public 包装 UMD 并导出 window.jQuery。
 */
import $ from './js/jquery.js';
window.$ = window.jQuery = $;
