"use client";

import {
  SpreadsheetUrlForm,
} from "./spreadsheet-url-form";

import {
  SpreadsheetSheetSelector,
} from "./spreadsheet-sheet-selector";

import {
  SpreadsheetActions,
} from "./spreadsheet-actions";

import {
  SpreadsheetPreview,
} from "./spreadsheet-preview";

import {
  useSpreadsheet,
} from "@/hooks/useSpreadsheet";

export function SpreadsheetConverter() {
  const spreadsheet =
    useSpreadsheet();

  const hasSheets =
    spreadsheet.sheets.length > 0;

  return (
    <div className="space-y-6 w-full">
      <SpreadsheetUrlForm
        url={spreadsheet.url}
        setUrl={spreadsheet.setUrl}
        loading={spreadsheet.loading}
        error={spreadsheet.error}
        onSubmit={
          spreadsheet.loadSpreadsheet
        }
      />

      {hasSheets && (
        <SpreadsheetSheetSelector
          selection={
            spreadsheet.selection
          }
          onToggleSheet={
            spreadsheet.toggleSheet
          }
          onToggleColumn={
            spreadsheet.toggleColumn
          }
          onRenameColumn={
            spreadsheet.renameColumn
          }
          onSelectAllSheets={
            spreadsheet.selectAllSheets
          }
          onDeselectAllSheets={
            spreadsheet.deselectAllSheets
          }
          onSelectAllColumns={
            spreadsheet.selectAllColumns
          }
          onDeselectAllColumns={
            spreadsheet.deselectAllColumns
          }
          onResetColumnKeys={
            spreadsheet.resetColumnKeys
          }
        />
      )}

      {hasSheets && (
        <SpreadsheetActions
          selectedCount={
            spreadsheet.selectedColumnCount
          }
          loading={
            spreadsheet.loading
          }
          onConvert={
            spreadsheet.convertSelectedSheets
          }
        />
      )}

      {spreadsheet.json && (
        <SpreadsheetPreview
          json={
            spreadsheet.json
          }
          convertedSheetCount={
            spreadsheet.convertedSheetCount
          }
          onCopy={
            spreadsheet.copyJson
          }
          onDownload={
            spreadsheet.downloadJson
          }
        />
      )}
    </div>
  );
}