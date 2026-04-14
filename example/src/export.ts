// import { createCellPos } from './translateNumToLetter'
import Excel from 'exceljs'

import FileSaver from 'file-saver'

const exportExcel = function (luckysheet: any, value: string) {
    // 参数为luckysheet.getluckysheetfile()获取的对象
    // 1.创建工作簿，可以为工作簿添加属性
    
    console.log('========== 导出时的完整 Luckysheet 数据 ==========')
    console.log('luckysheet 数据类型:', typeof luckysheet)
    console.log('luckysheet 是否为数组:', Array.isArray(luckysheet))
    console.log('luckysheet 完整数据:', JSON.stringify(luckysheet, null, 2))
    
    const workbook = new Excel.Workbook()
    // 2.创建表格，第二个参数可以配置创建什么样的工作表
    if (Object.prototype.toString.call(luckysheet) === '[object Object]') {
        luckysheet = [luckysheet]
    }
    luckysheet.forEach(function (table: any, index: number) {
        console.log(`\n===== 工作表 ${index + 1} 信息 =====`)
        console.log('工作表名称:', table.name)
        console.log('是否有 images 属性:', 'images' in table)
        
        if (table.images) {
            console.log('images 数据:', JSON.stringify(table.images, null, 2))
        }
        
        console.log('data 数组长度:', table.data?.length)
        
        if (table.data.length === 0) return true
        // ws.getCell('B2').fill = fills.
        const worksheet = workbook.addWorksheet(table.name)
        const merge = (table.config && table.config.merge) || {}
        const borderInfo = (table.config && table.config.borderInfo) || {}
        // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
        setStyleAndValue(table.data, worksheet)
        setMerge(merge, worksheet)
        setBorder(borderInfo, worksheet)
        // 4.设置图片
        if (table.images) {
            // 传递 visibledatarow 和 visibledatacolumn 用于精确计算位置
            setImages(table.images, worksheet, workbook, table.visibledatarow, table.visibledatacolumn)
        }
        return true
    })

    console.log('\n========== 数据处理完成，开始生成 Excel ==========')

    // return
    // 4.写入 buffer
    const buffer = workbook.xlsx.writeBuffer().then(data => {
        // console.log('data', data)
        const blob = new Blob([data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
        })
        console.log("导出成功！")
        FileSaver.saveAs(blob, `${value}.xlsx`)
    })
    return buffer
}

var setMerge = function (luckyMerge = {}, worksheet: any) {
    const mergearr = Object.values(luckyMerge)
    mergearr.forEach(function (elem: any) {
        // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
        // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
        worksheet.mergeCells(
            elem.r + 1,
            elem.c + 1,
            elem.r + elem.rs,
            elem.c + elem.cs
        )
    })
}

var setBorder = function (luckyBorderInfo: any, worksheet: any) {
    if (!Array.isArray(luckyBorderInfo)) return
    // console.log('luckyBorderInfo', luckyBorderInfo)
    luckyBorderInfo.forEach(function (elem) {
        // 现在只兼容到borderType 为range的情况
        // console.log('ele', elem)
        if (elem.rangeType === 'range') {
            let border = borderConvert(elem.borderType, elem.style, elem.color)
            let rang = elem.range[0]
            // console.log('range', rang)
            let row = rang.row
            let column = rang.column
            for (let i = row[0] + 1; i < row[1] + 2; i++) {
                for (let y = column[0] + 1; y < column[1] + 2; y++) {
                    worksheet.getCell(i, y).border = border
                }
            }
        }
        if (elem.rangeType === 'cell') {
            // col_index: 2
            // row_index: 1
            // b: {
            //   color: '#d0d4e3'
            //   style: 1
            // }
            const { col_index, row_index } = elem.value
            const borderData = Object.assign({}, elem.value)
            delete borderData.col_index
            delete borderData.row_index
            let border = addborderToCell(borderData, row_index, col_index)
            // console.log('bordre', border, borderData)
            worksheet.getCell(row_index + 1, col_index + 1).border = border
        }
        // console.log(rang.column_focus + 1, rang.row_focus + 1)
        // worksheet.getCell(rang.row_focus + 1, rang.column_focus + 1).border = border
    })
}

var setImages = function (images: any, worksheet: any, workbook: any, visibledatarow?: any, visibledatacolumn?: any) {
    console.log('开始处理图片...', images)
    console.log('visibledatarow:', visibledatarow)
    console.log('visibledatacolumn:', visibledatacolumn)
    
    Object.keys(images).forEach(function (imageId) {
        const image = images[imageId]
        console.log('处理图片:', imageId, image)
        
        try {
            // 获取图片的 base64 数据
            const base64Data = image.src
            
            // 从 base64 中提取图片类型和数据
            const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
            if (!matches) {
                console.error('无法解析图片数据:', imageId)
                return
            }
            
            const imageType = matches[1] // 'jpeg', 'png', etc.
            const imageData = matches[2] // base64 数据部分
            
            // 将 base64 转换为 Uint8Array（浏览器环境）
            const binaryString = atob(imageData)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }
            
            // 添加图片到工作簿
            const imageIdInWorkbook = workbook.addImage({
                buffer: bytes,
                extension: imageType.toLowerCase()
            })
            
            // 计算图片位置（从像素转换为 Excel 行列）
            // 优先使用 default 中的位置，如果没有则使用 fixedLeft/fixedTop
            const left = image.default?.left !== undefined ? image.default.left : (image.fixedLeft || 0)
            const top = image.default?.top !== undefined ? image.default.top : (image.fixedTop || 0)
            const width = image.default?.width || image.originWidth || 100
            const height = image.default?.height || image.originHeight || 100
            
            console.log('图片位置信息:', { left, top, width, height })
            
            let startCol = 0
            let startRow = 0
            let endCol = 0
            let endRow = 0
            
            // 如果有 visibledatarow 和 visibledatacolumn，使用它们来精确计算
            if (visibledatarow && visibledatacolumn) {
                // 找到 top 对应的行索引
                for (let i = 0; i < visibledatarow.length; i++) {
                    if (top < visibledatarow[i]) {
                        startRow = i
                        break
                    }
                    if (i === visibledatarow.length - 1) {
                        startRow = visibledatarow.length
                    }
                }
                
                // 找到 left 对应的列索引
                for (let j = 0; j < visibledatacolumn.length; j++) {
                    if (left < visibledatacolumn[j]) {
                        startCol = j
                        break
                    }
                    if (j === visibledatacolumn.length - 1) {
                        startCol = visibledatacolumn.length
                    }
                }
                
                // 计算结束位置（图片的右下角）
                const bottom = top + height
                const right = left + width
                
                // 找到 bottom 对应的行索引
                for (let i = 0; i < visibledatarow.length; i++) {
                    if (bottom <= visibledatarow[i]) {
                        endRow = i
                        break
                    }
                    if (i === visibledatarow.length - 1) {
                        endRow = visibledatarow.length
                    }
                }
                
                // 找到 right 对应的列索引
                for (let j = 0; j < visibledatacolumn.length; j++) {
                    if (right <= visibledatacolumn[j]) {
                        endCol = j
                        break
                    }
                    if (j === visibledatacolumn.length - 1) {
                        endCol = visibledatacolumn.length
                    }
                }
                
                console.log('图片覆盖范围:', { 
                    start: `R${startRow + 1}C${startCol + 1}`, 
                    end: `R${endRow + 1}C${endCol + 1}`,
                    pixelSize: `${width}x${height}`
                })
            } else {
                // 降级方案：使用默认列宽和行高
                const defaultColWidth = 73
                const defaultRowHeight = 20
                
                startCol = Math.floor(left / defaultColWidth)
                startRow = Math.floor(top / defaultRowHeight)
                endCol = Math.floor((left + width) / defaultColWidth)
                endRow = Math.floor((top + height) / defaultRowHeight)
            }
            
            console.log('转换后的位置:', { startCol, startRow, endCol, endRow })
            
            // 添加图片到工作表
            worksheet.addImage(imageIdInWorkbook, {
                tl: { col: startCol, row: startRow },
                br: { col: endCol, row: endRow },
                editAs: 'oneCell'
            })
            
            console.log('图片添加成功:', imageId)
        } catch (error) {
            console.error('添加图片失败:', imageId, error)
        }
    })
}
var setStyleAndValue = function (cellArr: any, worksheet: any) {
    if (!Array.isArray(cellArr)) return
    cellArr.forEach(function (row, rowid) {
        row.every(function (cell: any, columnid: any) {
            if (!cell) return true
            let fill = fillConvert(cell.bg)

            let font = fontConvert(
                cell.ff,
                cell.fc,
                cell.bl,
                cell.it,
                cell.fs,
                cell.cl,
                cell.ul
            )
            let alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr)
            let value: any = ''

            if (cell.f) {
                value = { formula: cell.f, result: cell.v }
            } else if (!cell.v && cell.ct && cell.ct.s) {
                // xls转为xlsx之后，内部存在不同的格式，都会进到富文本里，即值不存在与cell.v，而是存在于cell.ct.s之后
                // value = cell.ct.s[0].v
                cell.ct.s.forEach((arr: any) => {
                    value += arr.v
                })
            } else {
                value = cell.v
            }
            //  style 填入到_value中可以实现填充色
            let letter = createCellPos(columnid)
            let target = worksheet.getCell(letter + (rowid + 1))
            // console.log('1233', letter + (rowid + 1))
            for (const key in fill) {
                target.fill = fill
                break
            }
            target.font = font
            target.alignment = alignment
            target.value = value

            return true
        })
    })
}

var fillConvert = function (bg: any) {
    if (!bg) {
        return {}
    }
    // const bgc = bg.replace('#', '')
    let fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bg.replace('#', '') }
    }
    return fill
}

var fontConvert = function (
    ff = 0,
    fc = '#000000',
    bl = 0,
    it = 0,
    fs = 10,
    cl = 0,
    ul = 0
) {
    // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
    const luckyToExcel = {
        0: '微软雅黑',
        1: '宋体（Song）',
        2: '黑体（ST Heiti）',
        3: '楷体（ST Kaiti）',
        4: '仿宋（ST FangSong）',
        5: '新宋体（ST Song）',
        6: '华文新魏',
        7: '华文行楷',
        8: '华文隶书',
        9: 'Arial',
        10: 'Times New Roman ',
        11: 'Tahoma ',
        12: 'Verdana',
        num2bl: function (num: number) {
            return num === 0 ? false : true
        }
    }
    // 出现Bug，导入的时候ff为luckyToExcel的val

    let font = {
        name: typeof ff === 'number' ? luckyToExcel[ff as keyof typeof luckyToExcel] : ff,
        family: 1,
        size: fs,
        color: { argb: fc.replace('#', '') },
        bold: luckyToExcel.num2bl(bl),
        italic: luckyToExcel.num2bl(it),
        underline: luckyToExcel.num2bl(ul),
        strike: luckyToExcel.num2bl(cl)
    }

    return font
}

var alignmentConvert = function (
    vt = 'default',
    ht = 'default',
    tb = 'default',
    tr = 'default'
) {
    // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
    const luckyToExcel = {
        vertical: {
            0: 'middle',
            1: 'top',
            2: 'bottom',
            default: 'top'
        },
        horizontal: {
            0: 'center',
            1: 'left',
            2: 'right',
            default: 'left'
        },
        wrapText: {
            0: false,
            1: false,
            2: true,
            default: false
        },
        textRotation: {
            0: 0,
            1: 45,
            2: -45,
            3: 'vertical',
            4: 90,
            5: -90,
            default: 0
        }
    }

    let alignment = {
        vertical: luckyToExcel.vertical[vt as keyof typeof luckyToExcel.vertical],
        horizontal: luckyToExcel.horizontal[ht as keyof typeof luckyToExcel.horizontal],
        wrapText: luckyToExcel.wrapText[tb as keyof typeof luckyToExcel.wrapText],
        textRotation: luckyToExcel.textRotation[tr as keyof typeof luckyToExcel.textRotation]
    }
    return alignment
}

var borderConvert = function (borderType: any, style = 1, color = '#000') {
    // 对应luckysheet的config中borderinfo的的参数
    if (!borderType) {
        return {}
    }
    const luckyToExcel = {
        type: {
            'border-all': 'all',
            'border-top': 'top',
            'border-right': 'right',
            'border-bottom': 'bottom',
            'border-left': 'left'
        },
        style: {
            0: 'none',
            1: 'thin',
            2: 'hair',
            3: 'dotted',
            4: 'dashDot', // 'Dashed',
            5: 'dashDot',
            6: 'dashDotDot',
            7: 'double',
            8: 'medium',
            9: 'mediumDashed',
            10: 'mediumDashDot',
            11: 'mediumDashDotDot',
            12: 'slantDashDot',
            13: 'thick'
        }
    }
    let template = {
        style: luckyToExcel.style[style as keyof typeof luckyToExcel.style],
        color: { argb: color.replace('#', '') }
    }
    let border: any = {}
    if (luckyToExcel.type[borderType as keyof typeof luckyToExcel.type] === 'all') {
        border['top'] = template
        border['right'] = template
        border['bottom'] = template
        border['left'] = template
    } else {
        border[luckyToExcel.type[borderType as keyof typeof luckyToExcel.type]] = template
    }
    // console.log('border', border)
    return border
}

function addborderToCell(borders: any, row_index: number, col_index: number) {
    let border: any = {}
    const luckyExcel = {
        type: {
            l: 'left',
            r: 'right',
            b: 'bottom',
            t: 'top'
        },
        style: {
            0: 'none',
            1: 'thin',
            2: 'hair',
            3: 'dotted',
            4: 'dashDot', // 'Dashed',
            5: 'dashDot',
            6: 'dashDotDot',
            7: 'double',
            8: 'medium',
            9: 'mediumDashed',
            10: 'mediumDashDot',
            11: 'mediumDashDotDot',
            12: 'slantDashDot',
            13: 'thick'
        }
    }
    // console.log('borders', borders)
    for (const bor in borders) {
        // console.log(bor)
        if (borders[bor].color.indexOf('rgb') === -1) {
            border[luckyExcel.type[bor as keyof typeof luckyExcel.type]] = {
                style: luckyExcel.style[borders[bor].style as keyof typeof luckyExcel.style],
                color: { argb: borders[bor].color.replace('#', '') }
            }
        } else {
            border[luckyExcel.type[bor as keyof typeof luckyExcel.type]] = {
                style: luckyExcel.style[borders[bor].style as keyof typeof luckyExcel.style],
                color: { argb: borders[bor].color }
            }
        }
    }

    return border
}

function createCellPos(n: number) {
    let ordA = 'A'.charCodeAt(0)

    let ordZ = 'Z'.charCodeAt(0)
    let len = ordZ - ordA + 1
    let s = ''
    while (n >= 0) {
        s = String.fromCharCode((n % len) + ordA) + s

        n = Math.floor(n / len) - 1
    }
    return s
}

export {
    exportExcel
}