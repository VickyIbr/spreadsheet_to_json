import ExcelJS from "exceljs";

export type SheetRow = Record<string, unknown>;

export type SpreadsheetWorkbook = ExcelJS.Workbook;

export type ConvertedSheets = {
  result: Record<string, SheetRow[]>;
  json: string;
  sheetNames: string[];
};

import { convertSpreadsheetUrl } from "./spreadsheet-url";

export async function fetchSpreadsheet(
  inputUrl: string
): Promise<ExcelJS.Workbook> {
  const {
    downloadUrl,
    provider,
  } = convertSpreadsheetUrl(inputUrl);

  console.log("Spreadsheet URL:", {
    inputUrl,
    downloadUrl,
    provider,
  });

  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch spreadsheet (${response.status}).`
    );
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  console.log("Spreadsheet response:", {
    url: response.url,
    contentType,
  });

  const arrayBuffer = await response.arrayBuffer();

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

  console.log(
    "ExcelJS worksheets:",
    workbook.worksheets.map((worksheet) => ({
      id: worksheet.id,
      name: worksheet.name,
      state: worksheet.state,
      rowCount: worksheet.rowCount,
      columnCount: worksheet.columnCount,
    }))
  );

  if (!workbook.worksheets.length) {
    throw new Error(
      "No sheets found in this spreadsheet."
    );
  }

  return workbook;
}


function getCellValue(
  cell: ExcelJS.Cell
): unknown {
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

  if (typeof value === "object") {
    if ("text" in value) {
      return value.text;
    }

    if ("result" in value) {
      return value.result;
    }

    if ("hyperlink" in value && "text" in value) {
      return value.text;
    }
  }

  return String(value);
}

function worksheetToJson(
  worksheet: ExcelJS.Worksheet
): SheetRow[] {
  const rows: SheetRow[] = [];

  const headerRow = worksheet.getRow(1);

  const headers: string[] = [];

  headerRow.eachCell(
    {
      includeEmpty: true,
    },
    (cell, columnNumber) => {
      const value = getCellValue(cell);

      const header =
        value === null || value === ""
          ? `column_${columnNumber}`
          : String(value).trim();

      headers.push(header);
    }
  );

  if (!headers.length) {
    return rows;
  }

  worksheet.eachRow(
    {
      includeEmpty: false,
    },
    (row, rowNumber) => {
      // Row 1 = headers
      if (rowNumber === 1) {
        return;
      }

      const item: SheetRow = {};
      let hasValue = false;

      for (
        let columnNumber = 1;
        columnNumber <= headers.length;
        columnNumber++
      ) {
        const value = getCellValue(
          row.getCell(columnNumber)
        );

        item[headers[columnNumber - 1]] = value;

        if (
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
        ) {
          hasValue = true;
        }
      }

      if (hasValue) {
        rows.push(item);
      }
    }
  );

  return rows;
}

export function convertSheets(
  workbook: SpreadsheetWorkbook,
  selectedSheets: string[]
): ConvertedSheets {
  const result: Record<string, SheetRow[]> = {};

  for (const sheetName of selectedSheets) {
    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
      continue;
    }

    result[sheetName] = worksheetToJson(worksheet);
  }

  return {
    result,
    json: JSON.stringify(result, null, 2),
    sheetNames: Object.keys(result),
  };
}
