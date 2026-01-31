/// <reference types="vite/client" />

declare module 'luckyexcel' {
  const LuckyExcel: {
    transformExcelToLucky: (
      file: File,
      callback: (exportJson: unknown, luckysheetfile: unknown) => void
    ) => void
  }
  export default LuckyExcel
}
