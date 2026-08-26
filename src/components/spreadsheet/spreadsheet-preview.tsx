"use client";

import {
  Check,
  Clipboard,
  Download,
  FileJson,
} from "lucide-react";

import {
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SpreadsheetPreviewProps {
  json: string;
  convertedSheetCount: number;
  onCopy: () => Promise<void>;
  onDownload: () => void;
}

export function SpreadsheetPreview({
  json,
  convertedSheetCount,
  onCopy,
  onDownload,
}: SpreadsheetPreviewProps) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    await onCopy();

    setCopied(true);

    window.setTimeout(
      () => setCopied(false),
      1500
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-muted rounded-md size-9"
            >
              <FileJson className="size-4" />
            </div>

            <div>
              <CardTitle>
                JSON Output
              </CardTitle>

              <p className="text-muted-foreground text-sm">
                {convertedSheetCount}{" "}
                {convertedSheetCount === 1
                  ? "sheet"
                  : "sheets"}{" "}
                converted
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard />
                  Copy
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={onDownload}
            >
              <Download />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <pre
          className="bg-muted/30 p-4 max-h-[600px] overflow-auto font-mono text-sm leading-6"
        >
          <code>{json}</code>
        </pre>
      </CardContent>
    </Card>
  );
}