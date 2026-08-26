import ExcelJS from "exceljs";

import {
  convertSpreadsheetUrl,
} from "./spreadsheet-url";

import type {
  ConvertedSheets,
  SheetRow,
  SpreadsheetCellValue,
  SpreadsheetConversionOptions,
  SpreadsheetWorkbook,
} from "@/types/spreadsheet";

const DEFAULT_CONVERSION_OPTIONS: Required<
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
    DEFAULT_CONVERSION_OPTIONS.headerRow;

  return {
    ...DEFAULT_CONVERSION_OPTIONS,
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

  if (value === null || value === undefined) {
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

function createHeader(
  cell: ExcelJS.Cell,
  columnNumber: number,
  options: Required<SpreadsheetConversionOptions>
): string {
  const value = normalizeCellValue(cell);

  if (
    value === null ||
    String(value).trim() === ""
  ) {
    return `${options.emptyHeaderPrefix}_${columnNumber}`;
  }

  return String(value).trim();
}

function makeUniqueHeaders(
  headers: string[]
): string[] {
  const counts = new Map<string, number>();

  return headers.map((header) => {
    const count = counts.get(header) ?? 0;

    counts.set(header, count + 1);

    if (count === 0) {
      return header;
    }

    return `${header}_${count + 1}`;
  });
}

function getWorksheetHeaders(
  worksheet: ExcelJS.Worksheet,
  options: Required<SpreadsheetConversionOptions>
): string[] {
  const headerRow = worksheet.getRow(
    options.headerRow
  );

  const headers: string[] = [];

  headerRow.eachCell(
    {
      includeEmpty: true,
    },
    (cell, columnNumber) => {
      headers.push(
        createHeader(
          cell,
          columnNumber,
          options
        )
      );
    }
  );

  return options.makeHeadersUnique
    ? makeUniqueHeaders(headers)
    : headers;
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
  options: Required<SpreadsheetConversionOptions>
): SheetRow[] {
  const headers = getWorksheetHeaders(
    worksheet,
    options
  );

  if (!headers.length) {
    return [];
  }

  const rows: SheetRow[] = [];

  worksheet.eachRow(
    {
      includeEmpty: options.includeEmptyRows,
    },
    (row, rowNumber) => {
      if (rowNumber < options.dataStartRow) {
        return;
      }

      const item: SheetRow = {};

      for (
        let columnNumber = 1;
        columnNumber <= headers.length;
        columnNumber++
      ) {
        item[headers[columnNumber - 1]] =
          normalizeCellValue(
            row.getCell(columnNumber)
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
  const { downloadUrl } =
    convertSpreadsheetUrl(inputUrl);

  let response: Response;

  try {
    response = await fetch(downloadUrl);
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

  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(arrayBuffer);
  } catch {
    throw new Error(
      "The provided URL did not return a valid XLSX spreadsheet."
    );
  }

  if (!workbook.worksheets.length) {
    throw new Error(
      "No sheets found in this spreadsheet."
    );
  }

  return workbook;
}

export function convertSheets(
  workbook: SpreadsheetWorkbook,
  selectedSheets: string[],
  options?: SpreadsheetConversionOptions
): ConvertedSheets {
  const resolvedOptions =
    resolveOptions(options);

  const result: Record<
    string,
    SheetRow[]
  > = {};

  for (const sheetName of selectedSheets) {
    const worksheet =
      workbook.getWorksheet(sheetName);

    if (!worksheet) {
      continue;
    }

    result[sheetName] =
      worksheetToJson(
        worksheet,
        resolvedOptions
      );
  }

  const sheetNames = Object.keys(result);

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