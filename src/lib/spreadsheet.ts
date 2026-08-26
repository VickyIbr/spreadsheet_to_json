import ExcelJS from "exceljs";

import {
  convertSpreadsheetUrl,
} from "./spreadsheet-url";

import type {
  ConvertedSheets,
  SheetRow,
  SpreadsheetCellValue,
  SpreadsheetColumn,
  SpreadsheetConversionOptions,
  SpreadsheetResult,
  SpreadsheetSelection,
  SpreadsheetWorkbook,
} from "@/types/spreadsheet";

const DEFAULT_OPTIONS: Required<
  SpreadsheetConversionOptions
> = {
  headerRow: 1,
  dataStartRow: 2,
  emptyHeaderPrefix: "column",
  includeEmptyRows: false,
  makeHeadersUnique: true,
};

function resolveOptions(
  options?: SpreadsheetConversionOptions
): Required<SpreadsheetConversionOptions> {
  const headerRow =
    options?.headerRow ??
    DEFAULT_OPTIONS.headerRow;

  return {
    ...DEFAULT_OPTIONS,
    ...options,
    headerRow,
    dataStartRow:
      options?.dataStartRow ??
      headerRow + 1,
  };
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function normalizeCellValue(
  cell: ExcelJS.Cell
): SpreadsheetCellValue {
  const value = cell.value;

  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (isRecord(value)) {
    if (
      "text" in value &&
      typeof value.text === "string"
    ) {
      return value.text;
    }

    if ("result" in value) {
      const result = value.result;

      if (
        result === null ||
        result === undefined
      ) {
        return null;
      }

      if (
        typeof result === "string" ||
        typeof result === "number" ||
        typeof result === "boolean"
      ) {
        return result;
      }

      if (result instanceof Date) {
        return result.toISOString();
      }

      return String(result);
    }
  }

  return String(value);
}

function normalizeHeader(
  value: SpreadsheetCellValue,
  index: number,
  prefix: string
): string {
  if (
    value === null ||
    String(value).trim() === ""
  ) {
    return `${prefix}_${index}`;
  }

  return String(value).trim();
}

function makeUniqueHeaders(
  columns: SpreadsheetColumn[]
): SpreadsheetColumn[] {
  const counts = new Map<string, number>();

  return columns.map((column) => {
    const count =
      counts.get(column.originalKey) ?? 0;

    counts.set(
      column.originalKey,
      count + 1
    );

    if (count === 0) {
      return column;
    }

    return {
      ...column,
      originalKey:
        `${column.originalKey}_${count + 1}`,
      key:
        `${column.key}_${count + 1}`,
    };
  });
}

function getWorksheetColumns(
  worksheet: ExcelJS.Worksheet,
  options: Required<SpreadsheetConversionOptions>
): SpreadsheetColumn[] {
  const headerRow =
    worksheet.getRow(options.headerRow);

  const columns: SpreadsheetColumn[] = [];

  headerRow.eachCell(
    {
      includeEmpty: true,
    },
    (cell, columnNumber) => {
      const header =
        normalizeHeader(
          normalizeCellValue(cell),
          columnNumber,
          options.emptyHeaderPrefix
        );

      columns.push({
        originalKey: header,
        key: header,
        selected: true,
        index: columnNumber,
      });
    }
  );

  if (
    !options.makeHeadersUnique
  ) {
    return columns;
  }

  return makeUniqueHeaders(columns);
}

function hasRowValue(
  row: SheetRow
): boolean {
  return Object.values(row).some(
    (value) =>
      value !== null &&
      String(value).trim() !== ""
  );
}

function worksheetToJson(
  worksheet: ExcelJS.Worksheet,
  configuration: SpreadsheetSelection[string],
  options: Required<SpreadsheetConversionOptions>
): SheetRow[] {
  const selectedColumns =
    configuration.columns.filter(
      (column) => column.selected
    );

  if (!selectedColumns.length) {
    return [];
  }

  const rows: SheetRow[] = [];

  worksheet.eachRow(
    {
      includeEmpty:
        options.includeEmptyRows,
    },
    (row, rowNumber) => {
      if (
        rowNumber <
        options.dataStartRow
      ) {
        return;
      }

      const item: SheetRow = {};

      for (const column of selectedColumns) {
        item[column.key] =
          normalizeCellValue(
            row.getCell(column.index)
          );
      }

      if (
        options.includeEmptyRows ||
        hasRowValue(item)
      ) {
        rows.push(item);
      }
    }
  );

  return rows;
}

export async function fetchSpreadsheet(
  inputUrl: string
): Promise<SpreadsheetWorkbook> {
  const {
    downloadUrl,
  } =
    convertSpreadsheetUrl(inputUrl);

  let response: Response;

  try {
    response =
      await fetch(downloadUrl);
  } catch {
    throw new Error(
      "Unable to access this spreadsheet. The server may not allow browser requests (CORS)."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch spreadsheet (${response.status}).`
    );
  }

  const arrayBuffer =
    await response.arrayBuffer();

  if (!arrayBuffer.byteLength) {
    throw new Error(
      "The spreadsheet response is empty."
    );
  }

  const workbook =
    new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(
      arrayBuffer
    );
  } catch {
    throw new Error(
      "The provided URL did not return a valid XLSX spreadsheet."
    );
  }

  if (
    workbook.worksheets.length === 0
  ) {
    throw new Error(
      "No sheets found in this spreadsheet."
    );
  }

  return workbook;
}

export function getSheetConfiguration(
  workbook: SpreadsheetWorkbook,
  sheetName: string,
  options?: SpreadsheetConversionOptions
): SpreadsheetSelection[string] | null {
  const worksheet =
    workbook.getWorksheet(sheetName);

  if (!worksheet) {
    return null;
  }

  const resolvedOptions =
    resolveOptions(options);

  return {
    name: worksheet.name,
    columns:
      getWorksheetColumns(
        worksheet,
        resolvedOptions
      ),
  };
}

export function getSpreadsheetSelection(
  workbook: SpreadsheetWorkbook,
  options?: SpreadsheetConversionOptions
): SpreadsheetSelection {
  const selection: SpreadsheetSelection = {};

  for (const worksheet of workbook.worksheets) {
    const configuration =
      getSheetConfiguration(
        workbook,
        worksheet.name,
        options
      );

    if (configuration) {
      selection[worksheet.name] =
        configuration;
    }
  }

  return selection;
}

export function convertSheets(
  workbook: SpreadsheetWorkbook,
  selection: SpreadsheetSelection,
  options?: SpreadsheetConversionOptions
): ConvertedSheets {
  const resolvedOptions =
    resolveOptions(options);

  const result: SpreadsheetResult = {};

  for (
    const [
      sheetName,
      configuration,
    ] of Object.entries(selection)
  ) {
    const worksheet =
      workbook.getWorksheet(
        sheetName
      );

    if (!worksheet) {
      continue;
    }

    const selectedColumns =
      configuration.columns.filter(
        (column) => column.selected
      );

    if (!selectedColumns.length) {
      continue;
    }

    result[sheetName] =
      worksheetToJson(
        worksheet,
        configuration,
        resolvedOptions
      );
  }

  const sheetNames =
    Object.keys(result);

  return {
    result,
    sheetNames,
    json: JSON.stringify(
      result,
      null,
      2
    ),
  };
}