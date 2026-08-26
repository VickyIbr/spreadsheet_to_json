import { FileJson } from "lucide-react";

import { SpreadsheetConverter } from "@/components/spreadsheet/spreadsheet-converter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="flex flex-col gap-10 mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full max-w-4xl">
        <header className="space-y-5">
          <div className="flex justify-center items-center bg-muted border rounded-xl size-11">
            <FileJson className="size-5" />
          </div>

          <div className="space-y-2">
            <h1 className="font-bold text-3xl sm:text-4xl tracking-tight">
              Spreadsheet to JSON
            </h1>

            <p className="max-w-2xl text-muted-foreground">
              Convert spreadsheets into clean JSON directly in your
              browser.
            </p>
          </div>
        </header>

        <SpreadsheetConverter />

        <footer className="pt-2 text-muted-foreground text-sm text-center">
          Built with care by{" "}
          <a
            href="https://vicky.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            vicky.id
          </a>
        </footer>
      </div>
    </main>
  );
}