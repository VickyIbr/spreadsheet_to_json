import type ExcelJS from "exceljs";

export type SpreadsheetWorkbook = ExcelJS.Workbook;

export type SpreadsheetCellValue =
  | string
  | number
  | boolean
  | null;

export type SheetRow =
  Record<string, SpreadsheetCellValue>;

export type SpreadsheetResult =
  Record<string, SheetRow[]>;

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
   * Prefix for empty column headers.
   * Default: "column"
   */
  emptyHeaderPrefix?: string;

  /**
   * Include rows where every value is empty.
   * Default: false
   */
  includeEmptyRows?: boolean;

  /**
   * Automatically make duplicate headers unique.
   * Default: true
   */
  makeHeadersUnique?: boolean;
}

export interface SpreadsheetColumn {
  /**
   * Original column name from spreadsheet.
   */
  originalKey: string;

  /**
   * Key used in generated JSON.
   */
  key: string;

  /**
   * Whether this column will be exported.
   */
  selected: boolean;

  /**
   * Original Excel column index.
   */
  index: number;
}

export interface SpreadsheetSheet {
  /**
   * Original worksheet name.
   */
  name: string;

  /**
   * Columns available in this sheet.
   */
  columns: SpreadsheetColumn[];
}

export type SpreadsheetSelection =
  Record<string, SpreadsheetSheet>;

export interface ConvertedSheets {
  result: SpreadsheetResult;
  json: string;
  sheetNames: string[];
}