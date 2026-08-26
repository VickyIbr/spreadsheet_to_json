"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  convertSheets,
  fetchSpreadsheet,
  getSpreadsheetSelection,
} from "@/lib/spreadsheet";

import type {
  ConvertedSheets,
  SpreadsheetConversionOptions,
  SpreadsheetSelection,
  SpreadsheetWorkbook,
} from "@/types/spreadsheet";

interface UseSpreadsheetOptions
  extends SpreadsheetConversionOptions {
  downloadFileName?: string;
}

export function useSpreadsheet(
  options?: UseSpreadsheetOptions
) {
  const {
    downloadFileName =
      "spreadsheet.json",
    ...conversionOptions
  } = options ?? {};

  const [url, setUrl] =
    useState("");

  const [workbook, setWorkbook] =
    useState<SpreadsheetWorkbook | null>(
      null
    );

  const [selection, setSelection] =
    useState<SpreadsheetSelection>(
      {}
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [conversion, setConversion] =
    useState<ConvertedSheets | null>(
      null
    );

  const sheets =
    useMemo(
      () => Object.keys(selection),
      [selection]
    );

  const selectedSheets =
    useMemo(
      () =>
        Object.values(selection)
          .filter((sheet) =>
            sheet.columns.some(
              (column) =>
                column.selected
            )
          )
          .map((sheet) => sheet.name),
      [selection]
    );

  const selectedColumnCount =
    useMemo(
      () =>
        Object.values(selection).reduce(
          (total, sheet) =>
            total +
            sheet.columns.filter(
              (column) =>
                column.selected
            ).length,
          0
        ),
      [selection]
    );

  const clearSelection =
    useCallback(() => {
      setSelection({});
      setConversion(null);
    }, []);

  const loadSpreadsheet =
    useCallback(async () => {
      const inputUrl =
        url.trim();

      if (!inputUrl) {
        setError(
          "Please enter a spreadsheet URL."
        );
        return;
      }

      setLoading(true);
      setError(null);
      setConversion(null);
      clearSelection();

      try {
        const nextWorkbook =
          await fetchSpreadsheet(
            inputUrl
          );

        const nextSelection =
          getSpreadsheetSelection(
            nextWorkbook,
            conversionOptions
          );

        setWorkbook(
          nextWorkbook
        );

        setSelection(
          nextSelection
        );
      } catch (error) {
        setWorkbook(null);

        setError(
          getErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    }, [
      url,
      clearSelection,
      conversionOptions,
    ]);

  const toggleSheet =
    useCallback(
      (sheetName: string) => {
        setSelection(
          (current) => {
            const sheet =
              current[sheetName];

            if (!sheet) {
              return current;
            }

            const hasSelectedColumn =
              sheet.columns.some(
                (column) =>
                  column.selected
              );

            return {
              ...current,
              [sheetName]: {
                ...sheet,
                columns:
                  sheet.columns.map(
                    (column) => ({
                      ...column,
                      selected:
                        !hasSelectedColumn,
                    })
                  ),
              },
            };
          }
        );

        setConversion(null);
        setError(null);
      },
      []
    );

  const toggleColumn =
    useCallback(
      (
        sheetName: string,
        columnIndex: number
      ) => {
        setSelection(
          (current) => {
            const sheet =
              current[sheetName];

            if (!sheet) {
              return current;
            }

            return {
              ...current,
              [sheetName]: {
                ...sheet,
                columns:
                  sheet.columns.map(
                    (column) =>
                      column.index ===
                      columnIndex
                        ? {
                            ...column,
                            selected:
                              !column.selected,
                          }
                        : column
                  ),
              },
            };
          }
        );

        setConversion(null);
        setError(null);
      },
      []
    );

  const renameColumn =
    useCallback(
      (
        sheetName: string,
        columnIndex: number,
        key: string
      ) => {
        setSelection(
          (current) => {
            const sheet =
              current[sheetName];

            if (!sheet) {
              return current;
            }

            return {
              ...current,
              [sheetName]: {
                ...sheet,
                columns:
                  sheet.columns.map(
                    (column) =>
                      column.index ===
                      columnIndex
                        ? {
                            ...column,
                            key,
                          }
                        : column
                  ),
              },
            };
          }
        );

        setConversion(null);
        setError(null);
      },
      []
    );

  const selectAllSheets =
    useCallback(() => {
      setSelection(
        (current) => {
          const next = {
            ...current,
          };

          for (
            const sheetName of
              Object.keys(next)
          ) {
            next[sheetName] = {
              ...next[sheetName],
              columns:
                next[sheetName].columns.map(
                  (column) => ({
                    ...column,
                    selected: true,
                  })
                ),
            };
          }

          return next;
        }
      );

      setConversion(null);
    }, []);

  const deselectAllSheets =
    useCallback(() => {
      setSelection(
        (current) => {
          const next = {
            ...current,
          };

          for (
            const sheetName of
              Object.keys(next)
          ) {
            next[sheetName] = {
              ...next[sheetName],
              columns:
                next[sheetName].columns.map(
                  (column) => ({
                    ...column,
                    selected: false,
                  })
                ),
            };
          }

          return next;
        }
      );

      setConversion(null);
    }, []);

  const selectAllColumns =
    useCallback(
      (sheetName: string) => {
        setSelection(
          (current) => {
            const sheet =
              current[sheetName];

            if (!sheet) {
              return current;
            }

            return {
              ...current,
              [sheetName]: {
                ...sheet,
                columns:
                  sheet.columns.map(
                    (column) => ({
                      ...column,
                      selected: true,
                    })
                  ),
              },
            };
          }
        );

        setConversion(null);
      },
      []
    );

  const deselectAllColumns =
    useCallback(
      (sheetName: string) => {
        setSelection(
          (current) => {
            const sheet =
              current[sheetName];

            if (!sheet) {
              return current;
            }

            return {
              ...current,
              [sheetName]: {
                ...sheet,
                columns:
                  sheet.columns.map(
                    (column) => ({
                      ...column,
                      selected: false,
                    })
                  ),
              },
            };
          }
        );

        setConversion(null);
      },
      []
    );

  const resetColumnKeys =
    useCallback(
      (sheetName: string) => {
        setSelection(
          (current) => {
            const sheet =
              current[sheetName];

            if (!sheet) {
              return current;
            }

            return {
              ...current,
              [sheetName]: {
                ...sheet,
                columns:
                  sheet.columns.map(
                    (column) => ({
                      ...column,
                      key:
                        column.originalKey,
                    })
                  ),
              },
            };
          }
        );

        setConversion(null);
      },
      []
    );

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

      if (
        hasDuplicateKeys(
          selection
        )
      ) {
        setError(
          "Each selected column must have a unique JSON key."
        );
        return;
      }

      try {
        setError(null);

        const result =
          convertSheets(
            workbook,
            selection,
            conversionOptions
          );

        setConversion(
          result
        );
      } catch (error) {
        setError(
          getErrorMessage(error)
        );
      }
    }, [
      workbook,
      selection,
      selectedSheets,
      conversionOptions,
    ]);

  const copyJson =
    useCallback(async () => {
      if (!conversion?.json) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          conversion.json
        );
      } catch {
        setError(
          "Failed to copy JSON."
        );
      }
    }, [conversion]);

  const downloadJson =
    useCallback(() => {
      if (!conversion?.json) {
        return;
      }

      const blob =
        new Blob(
          [conversion.json],
          {
            type:
              "application/json",
          }
        );

      const objectUrl =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href =
        objectUrl;

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

    workbook,

    selection,
    sheets,
    selectedSheets,

    loading,
    error,

    conversion,

    json:
      conversion?.json ?? "",

    convertedSheetCount:
      conversion?.sheetNames.length ??
      0,

    selectedColumnCount,

    loadSpreadsheet,

    toggleSheet,
    toggleColumn,

    renameColumn,

    selectAllSheets,
    deselectAllSheets,

    selectAllColumns,
    deselectAllColumns,

    resetColumnKeys,

    convertSelectedSheets,

    copyJson,
    downloadJson,
  };
}

function hasDuplicateKeys(
  selection: SpreadsheetSelection
): boolean {
  for (
    const sheet of
      Object.values(selection)
  ) {
    const keys =
      sheet.columns
        .filter(
          (column) =>
            column.selected
        )
        .map(
          (column) =>
            column.key.trim()
        )
        .filter(Boolean);

    if (
      keys.length !==
      new Set(keys).size
    ) {
      return true;
    }
  }

  return false;
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}