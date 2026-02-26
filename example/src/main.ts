// luckysheet 已内置 jQuery、plugins，导入即会设置 window.jQuery
import 'luckysheet'

import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app');
