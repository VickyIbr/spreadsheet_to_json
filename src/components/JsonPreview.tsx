type JsonPreviewProps = {
  json: string;
  sheetCount: number;
  onCopy: () => void;
  onDownload: () => void;
};

export function JsonPreview({
  json,
  sheetCount,
  onCopy,
  onDownload,
}: JsonPreviewProps) {
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="font-semibold">JSON Preview</h2>

          <p className="mt-1 text-zinc-500 text-xs">
            {sheetCount} sheet
            {sheetCount !== 1 ? "s" : ""} converted
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="bg-white hover:bg-zinc-50 shadow-sm px-3 py-2 border border-zinc-200 rounded-lg font-medium text-xs transition"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="bg-zinc-950 hover:bg-zinc-800 px-3 py-2 rounded-lg font-medium text-white text-xs transition"
          >
            Download JSON
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 shadow-sm border border-zinc-200 rounded-xl overflow-hidden">
        <pre className="p-5 max-h-150 overflow-auto text-zinc-100 text-xs leading-6">
          <code>{json}</code>
        </pre>
      </div>
    </section>
  );
}
