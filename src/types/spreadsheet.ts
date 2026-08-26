import type ExcelJS from "exceljs";

export type SpreadsheetWorkbook = ExcelJS.Workbook;

export type SpreadsheetCellValue =
  | string
  | number
  | boolean
  | null;

export type SheetRow = Record<string, SpreadsheetCellValue>;

export type SpreadsheetResult = Record<string, SheetRow[]>;

export type SpreadsheetProvider =
  | "google-sheets"
  | "microsoft"
  | "direct";

export interface SpreadsheetUrlResult {
  originalUrl: string;
  downloadUrl: string;
  provider: SpreadsheetProvider;
}

export interface SpreadsheetConversionOptions {
  /**
   * Row containing column headers.
   * Default: 1
   */
  headerRow?: number;

  /**
   * First row containing data.
   * Default: headerRow + 1
   */
  dataStartRow?: number;

  /**
   * Prefix used when a header cell is empty.
   * Default: "column"
   */
  emptyHeaderPrefix?: string;

  /**
   * Whether rows containing no values should be included.
   * Default: false
   */
  includeEmptyRows?: boolean;

  /**
   * Whether duplicate headers should receive a suffix.
   * Default: true
   */
  makeHeadersUnique?: boolean;
}

export interface ConvertedSheets {
  result: SpreadsheetResult;
  json: string;
  sheetNames: string[];
}