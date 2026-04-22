/**
 * Spectrum Colorpicker ESM Wrapper
 * 将 UMD 格式的 spectrum.js 包装为 ESM 模块
 */
import "./spectrum.css";
import { spectrumFactory } from "./spectrum.js";

// 关键：直接使用全局 jQuery，而不是导入新的实例
// 这样可以确保 spectrum 注册到与 luckysheet 相同的 jQuery 上
let $;
if (typeof window !== "undefined" && window.jQuery) {
  $ = window.jQuery;
  // console.log('[spectrum-colorpicker] Using existing global jQuery');
  // console.log('[spectrum-colorpicker] jQuery fn keys:', Object.keys($.fn).length);
  spectrumFactory($);
} else {
  // 如果全局 jQuery 不存在，才导入
  throw new Error(
    "[spectrum-colorpicker] jQuery must be loaded before spectrum-colorpicker"
  );
}

// 验证 jQuery 是否有效
if (!$ || typeof $.fn !== "object") {
  throw new Error("[spectrum-colorpicker] Invalid jQuery instance");
}

// 步骤2: 验证 jQuery 是否已设置
if (typeof window !== "undefined") {
  // console.log('[spectrum-colorpicker] Before importing spectrum.js:');
  // console.log('  - window.jQuery:', typeof window.jQuery);
  // console.log('  - window.$.fn:', typeof (window.$ && window.$.fn));
}

// 步骤3: 导入 spectrum.js (UMD 格式)
// 此时 window.jQuery 应该已经设置好了


// 步骤4: 验证 spectrum 是否成功注册
if (typeof window !== "undefined") {
  // console.log('[spectrum-colorpicker] After importing spectrum.js:');
  // console.log('  - $.fn.spectrum:', typeof ($.fn && $.fn.spectrum));
  if (typeof $.fn.spectrum !== "function") {
    console.error(
      "[spectrum-colorpicker] ERROR: spectrum plugin not registered!"
    );
    console.error(
      "[spectrum-colorpicker] Available $.fn methods:",
      Object.keys($.fn || {}).slice(0, 20)
    );
  }
}
// 注意：不要在这里导入 i18n，让使用者按需导入
// import './i18n/index.js'

// 导出 spectrum 插件、jQuery 和 tinycolor
export default $.fn.spectrum;
export { $ as jquery };
export const tinycolor =
  typeof window !== "undefined" ? window.tinycolor : undefined;
