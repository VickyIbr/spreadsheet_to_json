"use client";

import {
  ArrowRight,
  Loader2,
  Link2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SpreadsheetUrlFormProps {
  url: string;
  setUrl: (value: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
}

export function SpreadsheetUrlForm({
  url,
  setUrl,
  loading,
  error,
  onSubmit,
}: SpreadsheetUrlFormProps) {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Spreadsheet URL
        </CardTitle>

        <CardDescription>
  Paste a Google Sheets URL. Make sure “Anyone with the link” is set to Viewer.
</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="spreadsheet-url">
              URL
            </Label>

            <div className="relative">
              <Link2
                className="top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2"
              />

              <Input
                id="spreadsheet-url"
                value={url}
                onChange={(event) =>
                  setUrl(event.target.value)
                }
                placeholder="https://docs.google.com/spreadsheets/..."
                className="pl-9"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={
              loading || !url.trim()
            }
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load Spreadsheet
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}