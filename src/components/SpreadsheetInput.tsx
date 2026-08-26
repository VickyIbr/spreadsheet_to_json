type SpreadsheetInputProps = {
  url: string;
  loading: boolean;
  onUrlChange: (url: string) => void;
  onLoad: () => void;
};

export function SpreadsheetInput({
  url,
  loading,
  onUrlChange,
  onLoad,
}: SpreadsheetInputProps) {
  return (
    <section className="bg-white shadow-sm p-5 border border-zinc-200 rounded-xl">
      <label
        htmlFor="spreadsheet-url"
        className="block mb-2 font-medium text-sm"
      >
        Spreadsheet URL
      </label>

      <div className="flex gap-2">
        <input
          id="spreadsheet-url"
          type="url"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onLoad();
            }
          }}
          placeholder="https://example.com/data.xlsx"
          className="flex-1 bg-white px-3 py-2.5 border border-zinc-300 focus:border-zinc-500 rounded-lg outline-none focus:ring-2 focus:ring-zinc-200 min-w-0 text-sm transition"
        />

        <button
          type="button"
          onClick={onLoad}
          disabled={loading}
          className="bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 px-5 py-2.5 rounded-lg font-medium text-white text-sm transition disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Convert"}
        </button>
      </div>

      <p className="mt-3 text-zinc-400 text-xs">
        The spreadsheet must be publicly accessible and allow
        browser requests.
      </p>
    </section>
  );
}
