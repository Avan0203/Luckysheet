/**
 * 在打包 plugins 时最先执行，将 jQuery 挂到 window，供 UMD 插件（spectrum、jquery-ui、sPage 等）使用。
 */
import $ from 'jquery';
window.$ = window.jQuery = $;
