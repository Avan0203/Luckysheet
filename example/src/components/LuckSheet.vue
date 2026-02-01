<template>
    <div style="position: absolute; top: 0">
        <input id="uploadBtn" type="file" @change="loadExcel" />
        <a href="javascript:void(0)" @click="downloadExcel">Download source xlsx file</a>
    </div>
    <div id="luckySheet"></div>
</template>
<script setup lang="ts">
import luckysheet from 'luckysheet';
import { ref, onMounted } from 'vue'
import { exportExcel } from '../export'
import LuckyExcel from 'luckyexcel';

// Luckysheet 样式（ESM 库统一入口，需先 pnpm build 根项目）
import 'luckysheet/dist/luckysheet.css';

const jsonData = ref({})

const loadExcel = (evt:Event) => {
    const files = (evt.target as HTMLInputElement)?.files
    if (files == null || files.length == 0) {
        alert('No files wait for import')
        return
    }

    let name = files[0]!.name
    let suffixArr = name.split('.'),
        suffix = suffixArr[suffixArr.length - 1]
    if (suffix != 'xlsx') {
        alert('Currently only supports the import of xlsx files')
        return
    }
    LuckyExcel.transformExcelToLucky(files[0]!, function (exportJson: any) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert('Failed to read the content of the excel file, currently does not support xls files!')
            return
        }
        console.log('exportJson', exportJson)
        jsonData.value = exportJson

        luckysheet.destroy()

        luckysheet.create({
            container: 'luckySheet', //luckysheet is the container id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
        })
    })
}


const downloadExcel = () => {
    exportExcel(luckysheet.getAllSheets(), '下载')
}

onMounted(() => {
    luckysheet.create({
        container: 'luckySheet',
    });
});

</script>

<style scoped>
#luckySheet {
    margin: 0px;
    padding: 0px;
    position: absolute;
    width: 100%;
    left: 0px;
    top: 30px;
    bottom: 0px;
}

#uploadBtn {
    font-size: 16px;
}

#tip {
    position: absolute;
    z-index: 1000000;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    font-size: 40px;
    align-items: center;
    justify-content: center;
    display: flex;
}
</style>