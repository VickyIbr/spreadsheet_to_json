export type SpreadsheetUrlResult = {
  originalUrl: string;
  downloadUrl: string;
  provider: "google-sheets" | "microsoft" | "direct";
};

export function convertSpreadsheetUrl(
  input: string
): SpreadsheetUrlResult {
  const url = input.trim();

  if (!url) {
    throw new Error("Spreadsheet URL is required.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid spreadsheet URL.");
  }

  /**
   * Google Sheets
   *
   * https://docs.google.com/spreadsheets/d/{ID}/edit
   *
   * becomes:
   *
   * https://docs.google.com/spreadsheets/d/{ID}/export?format=xlsx
   */
  if (
    parsedUrl.hostname === "docs.google.com" &&
    parsedUrl.pathname.startsWith("/spreadsheets/d/")
  ) {
    const match = parsedUrl.pathname.match(
      /^\/spreadsheets\/d\/([^/]+)/
    );

    if (!match) {
      throw new Error(
        "Invalid Google Sheets URL."
      );
    }

    const spreadsheetId = match[1];

    return {
      originalUrl: url,
      downloadUrl:
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`,
      provider: "google-sheets",
    };
  }

  /**
   * Google Sheets published/export URLs
   *
   * Example:
   * https://docs.google.com/spreadsheets/d/{ID}/export?format=xlsx
   */
  if (
    parsedUrl.hostname === "docs.googleusercontent.com"
  ) {
    return {
      originalUrl: url,
      downloadUrl: url,
      provider: "google-sheets",
    };
  }

  /**
   * Microsoft Excel / OneDrive
   *
   * Microsoft has several URL formats.
   * For now we keep the original URL because converting
   * OneDrive share links requires additional handling.
   */
  if (
    parsedUrl.hostname.includes("onedrive.live.com") ||
    parsedUrl.hostname.includes("1drv.ms") ||
    parsedUrl.hostname.includes("sharepoint.com")
  ) {
    return {
      originalUrl: url,
      downloadUrl: url,
      provider: "microsoft",
    };
  }

  /**
   * Assume direct XLSX / spreadsheet file.
   */
  return {
    originalUrl: url,
    downloadUrl: url,
    provider: "direct",
  };
}
