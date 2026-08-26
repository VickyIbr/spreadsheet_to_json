import type {
  SpreadsheetProvider,
  SpreadsheetUrlResult,
} from "@/types/spreadsheet";

const GOOGLE_SHEETS_HOST = "docs.google.com";
const GOOGLE_USER_CONTENT_HOST =
  "docs.googleusercontent.com";

const MICROSOFT_HOSTS = [
  "onedrive.live.com",
  "1drv.ms",
];

const MICROSOFT_HOST_SUFFIXES = [
  ".sharepoint.com",
];

function createResult(
  originalUrl: string,
  downloadUrl: string,
  provider: SpreadsheetProvider
): SpreadsheetUrlResult {
  return {
    originalUrl,
    downloadUrl,
    provider,
  };
}

function isMicrosoftHost(hostname: string): boolean {
  return (
    MICROSOFT_HOSTS.includes(hostname) ||
    MICROSOFT_HOST_SUFFIXES.some((suffix) =>
      hostname.endsWith(suffix)
    )
  );
}

function resolveGoogleSheets(
  url: URL,
  originalUrl: string
): SpreadsheetUrlResult | null {
  if (
    url.hostname === GOOGLE_USER_CONTENT_HOST
  ) {
    return createResult(
      originalUrl,
      originalUrl,
      "google-sheets"
    );
  }

  if (
    url.hostname !== GOOGLE_SHEETS_HOST ||
    !url.pathname.startsWith("/spreadsheets/d/")
  ) {
    return null;
  }

  const match = url.pathname.match(
    /^\/spreadsheets\/d\/([^/]+)/
  );

  if (!match) {
    throw new Error("Invalid Google Sheets URL.");
  }

  const [, spreadsheetId] = match;

  return createResult(
    originalUrl,
    `https://${GOOGLE_SHEETS_HOST}/spreadsheets/d/${spreadsheetId}/export?format=xlsx`,
    "google-sheets"
  );
}

export function convertSpreadsheetUrl(
  input: string
): SpreadsheetUrlResult {
  const originalUrl = input.trim();

  if (!originalUrl) {
    throw new Error("Spreadsheet URL is required.");
  }

  let url: URL;

  try {
    url = new URL(originalUrl);
  } catch {
    throw new Error("Invalid spreadsheet URL.");
  }

  const googleResult = resolveGoogleSheets(
    url,
    originalUrl
  );

  if (googleResult) {
    return googleResult;
  }

  if (isMicrosoftHost(url.hostname)) {
    return createResult(
      originalUrl,
      originalUrl,
      "microsoft"
    );
  }

  return createResult(
    originalUrl,
    originalUrl,
    "direct"
  );
}