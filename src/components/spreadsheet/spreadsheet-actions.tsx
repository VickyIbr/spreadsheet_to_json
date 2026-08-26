"use client";

import {
  ArrowRight,
  FileJson,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface SpreadsheetActionsProps {
  selectedCount: number;
  loading: boolean;
  onConvert: () => void;
}

export function SpreadsheetActions({
  selectedCount,
  loading,
  onConvert,
}: SpreadsheetActionsProps) {
  return (
    <Card>
      <CardContent className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-muted rounded-md size-9">
            <FileJson className="size-4" />
          </div>

          <div>
            <p className="font-medium text-sm">
              Ready to convert
            </p>

            <p className="text-muted-foreground text-sm">
              {selectedCount}{" "}
              {selectedCount === 1
                ? "column"
                : "columns"}{" "}
              selected
            </p>
          </div>
        </div>

        <Button
          onClick={onConvert}
          disabled={
            loading ||
            selectedCount === 0
          }
        >
          Convert to JSON
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  );
}