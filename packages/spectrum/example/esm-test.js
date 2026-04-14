// esm-test.js - 测试ESM打包产物
// 注意：jQuery 已经在 HTML 中通过 inline module script 设置到全局

import spectrum, { jquery, tinycolor } from '../dist/spectrum.esm.js';
import '../dist/spectrum-colorpicker.css';

// 导入所有语言文件（会立即执行并注册到 $.spectrum.localization）
import '../dist/i18n/jquery.spectrum-zh-cn.js';
import '../dist/i18n/jquery.spectrum-zh-tw.js';
import '../dist/i18n/jquery.spectrum-en.js';

console.log('Spectrum ESM test started');
console.log('jQuery version:', jquery.fn.jquery);
console.log('Spectrum plugin available:', typeof jquery.fn.spectrum);
console.log('Tinycolor available:', typeof tinycolor);
console.log('Available localizations:', Object.keys($.spectrum.localization));

$(document).ready(function() {
    
    // 语言切换功能
    let currentLanguage = 'en';
    const colorPickers = [];
    
    // 获取指定语言的配置
    function getLangConfig(lang) {
        if (lang === 'en') {
            return {};
        }
        // 从已注册的 localization 中获取
        const localization = $.spectrum.localization[lang];
        if (localization) {
            return localization;
        }
        return {};
    }
    
    function initColorPickers(lang) {
        // 销毁现有的实例
        colorPickers.forEach(picker => {
            if (picker && picker.spectrum) {
                picker.spectrum('destroy');
            }
        });
        colorPickers.length = 0;
        
        // 获取语言配置
        const langConfig = getLangConfig(lang);
        
        console.log(`Initializing with language: ${lang}`, langConfig);
        
        // 基本用法测试
        const basicPicker = $('#basic').spectrum({
            ...langConfig,
            color: '#ff0000',
            showInput: true,
            change: function(color) {
                console.log('Color changed to:', color.toHexString());
            }
        });
        colorPickers.push(basicPicker);
        
        // 带透明度的测试
        const alphaPicker = $('#withAlpha').spectrum({
            ...langConfig,
            color: 'rgba(255, 0, 0, 0.5)',
            showAlpha: true,
            showInput: true,
            change: function(color) {
                console.log('Color with alpha changed to:', color.toRgbString());
            }
        });
        colorPickers.push(alphaPicker);
        
        // 调色板测试
        const palettePicker = $('#palette').spectrum({
            ...langConfig,
            color: '#00ff00',
            showPalette: true,
            palette: [
                ['red', 'yellow', 'green', 'blue', 'purple'],
                ['orange', 'pink', 'cyan', 'magenta', 'lime']
            ],
            change: function(color) {
                console.log('Palette color changed to:', color.toHexString());
            }
        });
        colorPickers.push(palettePicker);
        
        // 平面模式测试
        const flatPicker = $('#flat').spectrum({
            ...langConfig,
            color: '#0000ff',
            flat: true,
            showInput: true,
            change: function(color) {
                console.log('Flat picker color changed to:', color.toHexString());
            }
        });
        colorPickers.push(flatPicker);
        
        // 基准测试案例 - Full Example
        const fullPicker = $('#full').spectrum({
            ...langConfig,
            color: "#ECC",
            flat: true,
            showInput: true,
            className: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            maxPaletteSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.esm.test",
            move: function (color) {
                // console.log('Color moving:', color.toHexString());
            },
            show: function () {
                // console.log('Picker shown');
            },
            beforeShow: function () {
                // console.log('Before show');
            },
            hide: function (color) {
                // console.log('Picker hidden');
            },
            change: function(color) {
                console.log('Full example color changed:', color.toHexString());
            },
            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
            ]
        });
        colorPickers.push(fullPicker);
        
        console.log(`Color pickers initialized with language: ${lang}`);
    }
    
    // 初始化颜色选择器（默认英文）
    initColorPickers(currentLanguage);
    
    // 监听语言切换
    $('#languageSelect').on('change', function() {
        currentLanguage = $(this).val();
        console.log('Switching to language:', currentLanguage);
        initColorPickers(currentLanguage);
    });
    
    // Update Palette 按钮功能（来自 testcase.html）
    $('#updatePalette').on('click', function() {
        const currentPalette = $('#full').spectrum('option', 'palette');
        console.log('Current palette:', currentPalette);
        
        // 更新为简化的调色板
        $('#full').spectrum('option', 'palette', [
            ["red", "green", "blue"]
        ]);
        console.log('Palette updated to: red, green, blue');
    });
});
