"use client";

import {
  useCallback,
  useState,
} from "react";

import type ExcelJS from "exceljs";

import {
  convertSheets,
  fetchSpreadsheet,
} from "@/lib/spreadsheet";

import type {
  ConvertedSheets,
  SpreadsheetConversionOptions,
} from "@/types/spreadsheet";

interface UseSpreadsheetOptions
  extends SpreadsheetConversionOptions {
  downloadFileName?: string;
}

export function useSpreadsheet(
  options?: UseSpreadsheetOptions
) {
  const {
    downloadFileName = "spreadsheet.json",
    ...conversionOptions
  } = options ?? {};

  const [url, setUrl] = useState("");

  const [workbook, setWorkbook] =
    useState<ExcelJS.Workbook | null>(null);

  const [sheets, setSheets] =
    useState<string[]>([]);

  const [selectedSheets, setSelectedSheets] =
    useState<string[]>([]);

  const [conversion, setConversion] =
    useState<ConvertedSheets | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const clearSpreadsheet = useCallback(() => {
    setWorkbook(null);
    setSheets([]);
    setSelectedSheets([]);
    setConversion(null);
  }, []);

  const loadSpreadsheet = useCallback(
    async () => {
      const inputUrl = url.trim();

      if (!inputUrl) {
        setError(
          "Please enter a spreadsheet URL."
        );
        return;
      }

      setLoading(true);
      setError(null);
      setConversion(null);
      clearSpreadsheet();

      try {
        const nextWorkbook =
          await fetchSpreadsheet(
            inputUrl
          );

        const availableSheets =
          nextWorkbook.worksheets.map(
            (worksheet) =>
              worksheet.name
          );

        setWorkbook(nextWorkbook);
        setSheets(availableSheets);
        setSelectedSheets(
          availableSheets
        );
      } catch (error) {
        setError(
          getSpreadsheetErrorMessage(
            error
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [url, clearSpreadsheet]
  );

  const toggleSheet = useCallback(
    (sheetName: string) => {
      setSelectedSheets(
        (current) =>
          current.includes(sheetName)
            ? current.filter(
                (name) =>
                  name !== sheetName
              )
            : [
                ...current,
                sheetName,
              ]
      );

      setConversion(null);
      setError(null);
    },
    []
  );

  const selectAll = useCallback(() => {
    setSelectedSheets(sheets);
    setConversion(null);
    setError(null);
  }, [sheets]);

  const deselectAll = useCallback(() => {
    setSelectedSheets([]);
    setConversion(null);
    setError(null);
  }, []);

  const convertSelectedSheets =
    useCallback(() => {
      if (!workbook) {
        setError(
          "Spreadsheet is no longer available. Please load it again."
        );
        return;
      }

      if (!selectedSheets.length) {
        setError(
          "Please select at least one sheet."
        );
        return;
      }

      try {
        setError(null);

        const result = convertSheets(
          workbook,
          selectedSheets,
          conversionOptions
        );

        setConversion(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to convert spreadsheet."
        );
      }
    }, [
      workbook,
      selectedSheets,
      conversionOptions,
    ]);

  const copyJson = useCallback(
    async () => {
      const json =
        conversion?.json;

      if (!json) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          json
        );
      } catch {
        setError(
          "Failed to copy JSON."
        );
      }
    },
    [conversion]
  );

  const downloadJson = useCallback(() => {
    const json =
      conversion?.json;

    if (!json) {
      return;
    }

    const blob = new Blob(
      [json],
      {
        type: "application/json",
      }
    );

    const objectUrl =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = objectUrl;
    anchor.download =
      downloadFileName;

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(
      objectUrl
    );
  }, [
    conversion,
    downloadFileName,
  ]);

  return {
    url,
    setUrl,

    sheets,
    selectedSheets,

    loading,
    error,

    workbook,
    conversion,

    json: conversion?.json ?? "",
    convertedSheetCount:
      conversion?.sheetNames.length ?? 0,

    loadSpreadsheet,
    toggleSheet,
    selectAll,
    deselectAll,
    convertSelectedSheets,
    copyJson,
    downloadJson,
  };
}

function getSpreadsheetErrorMessage(
  error: unknown
): string {
  if (error instanceof TypeError) {
    return (
      "Unable to access this spreadsheet. The server may not allow browser requests (CORS)."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}