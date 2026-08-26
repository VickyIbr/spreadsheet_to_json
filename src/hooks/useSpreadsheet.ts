"use client";

import { useState } from "react";
import type ExcelJS from "exceljs";
import {
  convertSheets,
  fetchSpreadsheet,
} from "@/lib/spreadsheet";

export function useSpreadsheet() {
  const [url, setUrl] = useState("");

  const [workbook, setWorkbook] =
    useState<ExcelJS.Workbook | null>(null);

  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] =
    useState<string[]>([]);

  const [convertedSheetCount, setConvertedSheetCount] =
    useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [json, setJson] = useState("");

  const loadSpreadsheet = async () => {
    if (!url.trim()) {
      setError("Please enter a spreadsheet URL.");
      return;
    }

    setLoading(true);
    setError("");
    setJson("");
    setConvertedSheetCount(0);
    setSheets([]);
    setSelectedSheets([]);
    setWorkbook(null);

    try {
      const workbook = await fetchSpreadsheet(url);

      const availableSheets = workbook.worksheets.map(
        (worksheet) => worksheet.name
      );

      setWorkbook(workbook);
      setSheets(availableSheets);
      setSelectedSheets(availableSheets);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Unable to access this spreadsheet. The server may not allow browser requests (CORS)."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSheet = (sheetName: string) => {
    setSelectedSheets((current) =>
      current.includes(sheetName)
        ? current.filter((name) => name !== sheetName)
        : [...current, sheetName]
    );
  };

  const selectAll = () => {
    setSelectedSheets(sheets);
  };

  const deselectAll = () => {
    setSelectedSheets([]);
  };

  const convertSelectedSheets = () => {
    if (!selectedSheets.length) {
      setError("Please select at least one sheet.");
      return;
    }

    if (!workbook) {
      setError(
        "Spreadsheet is no longer available. Please load it again."
      );
      return;
    }

    try {
      setError("");

      const { json, sheetNames } = convertSheets(
        workbook,
        selectedSheets
      );

      setJson(json);
      setConvertedSheetCount(sheetNames.length);
    } catch {
      setError("Failed to convert spreadsheet.");
    }
  };

  const copyJson = async () => {
    if (!json) return;

    try {
      await navigator.clipboard.writeText(json);
    } catch {
      setError("Failed to copy JSON.");
    }
  };

  const downloadJson = () => {
    if (!json) return;

    const blob = new Blob([json], {
      type: "application/json",
    });

    const downloadUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = "spreadsheet.json";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(downloadUrl);
  };

  return {
    url,
    setUrl,

    sheets,
    selectedSheets,

    convertedSheetCount,

    loading,
    error,
    json,

    loadSpreadsheet,
    toggleSheet,
    selectAll,
    deselectAll,
    convertSelectedSheets,
    copyJson,
    downloadJson,
  };
}
