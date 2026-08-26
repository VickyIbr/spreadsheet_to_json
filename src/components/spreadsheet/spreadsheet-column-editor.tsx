"use client";

import {
    RotateCcw,
} from "lucide-react";

import {
    Checkbox,
} from "@/components/ui/checkbox";

import {
    Input,
} from "@/components/ui/input";

import {
    Button,
} from "@/components/ui/button";

import {
    Badge,
} from "@/components/ui/badge";

import type {
    SpreadsheetSheet,
} from "@/types/spreadsheet";

interface SpreadsheetColumnEditorProps {
    sheet: SpreadsheetSheet;

    onToggleColumn: (
        columnIndex: number
    ) => void;

    onRenameColumn: (
        columnIndex: number,
        key: string
    ) => void;

    onSelectAll: () => void;
    onDeselectAll: () => void;
    onResetKeys: () => void;
}

export function SpreadsheetColumnEditor({
    sheet,
    onToggleColumn,
    onRenameColumn,
    onSelectAll,
    onDeselectAll,
    onResetKeys,
}: SpreadsheetColumnEditorProps) {
    const selectedCount =
        sheet.columns.filter(
            (column) =>
                column.selected
        ).length;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                        {selectedCount} /{" "}
                        {sheet.columns.length}{" "}
                        columns selected
                    </span>

                    {selectedCount === 0 && (
                        <Badge variant="destructive">
                            No columns
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSelectAll}
                    >
                        Select all
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onDeselectAll}
                    >
                        Clear
                    </Button>

                    <Button
                        // type="ghost"
                        size="sm"
                        onClick={onResetKeys}
                    >
                        <RotateCcw />
                        Reset keys
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                {sheet.columns.map((column) => (
                    <div
                        key={column.index}
                        className="items-center sm:items-center gap-x-3 gap-y-2 grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] p-3 border rounded-md"
                    >
                        <Checkbox
                            checked={column.selected}
                            onCheckedChange={() =>
                                onToggleColumn(
                                    column.index
                                )
                            }
                            className="row-span-2 sm:row-span-1"
                        />

                        <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                                {column.originalKey}
                            </p>

                            <p className="text-muted-foreground text-xs">
                                Column {column.index}
                            </p>
                        </div>

                        <Input
                            value={column.key}
                            onChange={(event) =>
                                onRenameColumn(
                                    column.index,
                                    event.target.value
                                )
                            }
                            disabled={!column.selected}
                            placeholder="JSON key"
                            aria-label={`JSON key for ${column.originalKey}`}
                            className="sm:w-full min-w-0"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}