// 等挂到 window，供 luckysheet 使用
import './plugins-entry.js'

import './css/luckysheet.css'
import './utils/math'
import { luckysheet } from './core'
import __firefox from './utils/polyfill'
// Prevent gulp warning: 'Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification'
// window.evall = window.eval;
// polyfill event in firefox
if (window.addEventListener && (navigator.userAgent.indexOf("Firefox") > 0)) {
    __firefox();
}

if(import.meta.env.MODE === 'production'){
    console.log('luckysheet from dist');
}else{
    console.log('luckysheet from src');
}


export { luckysheet };