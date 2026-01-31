/**
 * Luckysheet - 纯前端表格库
 * 由 JS 源码生成的最小类型声明，可在源码中补充 JSDoc 后使用 tsc 重新生成更完整的类型
 */
export interface LuckysheetSetting {
  container?: string;
  title?: string;
  lang?: string;
  data?: unknown[];
  column?: number;
  row?: number;
  loadUrl?: string;
  allowEdit?: boolean;
  [key: string]: unknown;
}

export interface LuckysheetAPI {
  create(setting: LuckysheetSetting): void;
  toJson(): unknown;
  getLuckysheetfile(): unknown;
  getCellValue(row: number, column: number, options?: Record<string, unknown>): unknown;
  setCellValue(row: number, column: number, value: unknown, options?: Record<string, unknown>): void;
  refresh(options?: Record<string, unknown>): void;
  destroy(): void;
  getAllSheets(): any[];
  [key: string]: unknown;
}

declare const luckysheet: LuckysheetAPI;
export default luckysheet;
