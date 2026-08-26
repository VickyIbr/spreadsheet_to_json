"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { JsonPreview } from "@/components/JsonPreview";
import { SheetSelector } from "@/components/SheetSelector";
import { SpreadsheetInput } from "@/components/SpreadsheetInput";
import { useSpreadsheet } from "@/hooks/useSpreadsheet";

export default function Home() {
  const spreadsheet = useSpreadsheet();

  return (
    <main className="bg-zinc-50 min-h-screen text-zinc-950">
      <div className="mx-auto px-6 py-16 w-full max-w-4xl">
        <header className="mb-10">
          <h1 className="font-bold text-3xl tracking-tight">
            Spreadsheet to JSON
          </h1>

          <p className="mt-2 text-zinc-500 text-sm">
            Convert your spreadsheet into JSON directly in your browser.
          </p>
        </header>

        <SpreadsheetInput
          url={spreadsheet.url}
          loading={spreadsheet.loading}
          onUrlChange={spreadsheet.setUrl}
          onLoad={spreadsheet.loadSpreadsheet}
        />


        {spreadsheet.sheets.length > 0 && (
          <SheetSelector
            sheets={spreadsheet.sheets}
            selectedSheets={spreadsheet.selectedSheets}
            onToggle={spreadsheet.toggleSheet}
            onSelectAll={spreadsheet.selectAll}
            onDeselectAll={spreadsheet.deselectAll}
            onConvert={spreadsheet.convertSelectedSheets}
          />
        )}

        {spreadsheet.json && (
          <JsonPreview
            json={spreadsheet.json}
            sheetCount={spreadsheet.convertedSheetCount}
            onCopy={spreadsheet.copyJson}
            onDownload={spreadsheet.downloadJson}
          />
        )}

        <footer className="mt-10 text-zinc-400 text-xs text-center">
          Your spreadsheet is processed locally in your browser.
        </footer>
      </div>
    </main>
  );
}
