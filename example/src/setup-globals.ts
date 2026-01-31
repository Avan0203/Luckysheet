/**
 * 必须在 main.ts 最前 import，在加载 Luckysheet 前挂好 window.$、window.uuid 及 jQuery 插件
 */
import $ from 'jquery'
;(window as any).$ = (window as any).jQuery = $
// jquery-mousewheel 是 UMD，在 ESM 下只导出工厂函数，需手动传入 $ 才会给 $.fn 挂上 .mousewheel
import mousewheelFactory from 'jquery-mousewheel'
if (typeof mousewheelFactory === 'function') {
  mousewheelFactory($)
}
import * as uuid from 'uuid'
;(window as any).uuid = uuid
