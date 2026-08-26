import type * as XLSX from "xlsx";

declare global {
  interface Window {
    __spreadsheetWorkbook?: XLSX.WorkBook;
  }
}

export {};
