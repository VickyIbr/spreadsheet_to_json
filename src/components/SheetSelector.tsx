type SheetSelectorProps = {
  sheets: string[];
  selectedSheets: string[];
  onToggle: (sheetName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onConvert: () => void;
};

export function SheetSelector({
  sheets,
  selectedSheets,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onConvert,
}: SheetSelectorProps) {
  return (
    <section className="bg-white shadow-sm mt-6 p-5 border border-zinc-200 rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">Select sheets</h2>

          <p className="mt-1 text-zinc-500 text-xs">
            Choose one or multiple sheets to convert.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="font-medium text-zinc-600 hover:text-zinc-950 text-xs"
          >
            Select all
          </button>

          <span className="text-zinc-300">/</span>

          <button
            type="button"
            onClick={onDeselectAll}
            className="font-medium text-zinc-600 hover:text-zinc-950 text-xs"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {sheets.map((sheetName) => {
          const checked = selectedSheets.includes(sheetName);

          return (
            <label
              key={sheetName}
              className="flex items-center gap-3 hover:bg-zinc-50 px-3 py-3 border border-zinc-200 rounded-lg transition cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(sheetName)}
                className="border-zinc-300 rounded w-4 h-4 accent-zinc-950"
              />

              <span className="text-sm">{sheetName}</span>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onConvert}
        disabled={!selectedSheets.length}
        className="bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 mt-5 px-4 py-2.5 rounded-lg w-full font-medium text-white text-sm transition cursor-pointer disabled:cursor-not-allowed"
      >
        Convert selected sheets
      </button>
    </section>
  );
}
