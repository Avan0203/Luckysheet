/**
 * Spectrum Colorpicker ESM Wrapper
 * 将 UMD 格式的 spectrum.js 包装为 ESM 模块
 * 
 * 注意：由于 spectrum.js 使用 UMD 格式，需要在导入此模块之前
 * 确保 jQuery 已经在全局可用 (window.jQuery)
 */

// 导入 jQuery (spectrum 的依赖)
import $ from 'jquery';

// 立即设置全局 jQuery，这会在模块求值时执行
// 但由于 ESM import hoisting，spectrum.js 的 import 会先于此执行
// 所以这个方案不可靠，需要使用者在使用前手动设置全局 jQuery
if (typeof window !== 'undefined') {
  window.jQuery = $;
  window.$ = $;
}

// 导入原始的 spectrum.js (UMD 格式会自动检测并注册到 $.fn.spectrum)
// 警告：如果全局 jQuery 未设置，这里会报错
import './spectrum.js';
import './spectrum.css';
// 注意：不要在这里导入 i18n，让使用者按需导入
// import './i18n/index.js'


// 导出 spectrum 插件、jQuery 和 tinycolor
export default $.fn.spectrum;
export { $ as jquery };
export const tinycolor = typeof window !== 'undefined' ? window.tinycolor : undefined;
