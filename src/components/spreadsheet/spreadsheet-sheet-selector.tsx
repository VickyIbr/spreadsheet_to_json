"use client";

import { CheckCheck } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { SpreadsheetColumnEditor } from "./spreadsheet-column-editor";

import type {
    SpreadsheetSelection,
} from "@/types/spreadsheet";

interface SpreadsheetSheetSelectorProps {
    selection: SpreadsheetSelection;

    onToggleSheet: (
        sheetName: string
    ) => void;

    onToggleColumn: (
        sheetName: string,
        columnIndex: number
    ) => void;

    onRenameColumn: (
        sheetName: string,
        columnIndex: number,
        key: string
    ) => void;

    onSelectAllSheets: () => void;
    onDeselectAllSheets: () => void;

    onSelectAllColumns: (
        sheetName: string
    ) => void;

    onDeselectAllColumns: (
        sheetName: string
    ) => void;

    onResetColumnKeys: (
        sheetName: string
    ) => void;
}

export function SpreadsheetSheetSelector({
    selection,
    onToggleSheet,
    onToggleColumn,
    onRenameColumn,
    onSelectAllSheets,
    onDeselectAllSheets,
    onSelectAllColumns,
    onDeselectAllColumns,
    onResetColumnKeys,
}: SpreadsheetSheetSelectorProps) {
    const sheets = Object.values(selection);

    const selectedSheets = sheets.filter((sheet) =>
        sheet.columns.some(
            (column) => column.selected
        )
    ).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3">
                    <div className="min-w-0">
                        <CardTitle>
                            Configure Sheets
                        </CardTitle>

                        <CardDescription>
                            Select sheets, choose columns,
                            and customize JSON keys.
                        </CardDescription>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onSelectAllSheets}
                        >
                            <CheckCheck />
                            All
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onDeselectAllSheets}
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    {selectedSheets} / {sheets.length} sheets selected
                </p>
            </CardHeader>

            <CardContent>
                <Accordion
                    type="multiple"
                    className="w-full"
                >
                    {sheets.map((sheet) => {
                        const selectedCount =
                            sheet.columns.filter(
                                (column) => column.selected
                            ).length;

                        const selected =
                            selectedCount > 0;

                        return (
                            <AccordionItem
                                key={sheet.name}
                                value={sheet.name}
                            >
                                <div className="flex items-center min-w-0">
                                    {/* Sheet checkbox */}
                                    <div className="flex items-center pr-2 shrink-0">
                                        <Checkbox
                                            checked={selected}
                                            onCheckedChange={() =>
                                                onToggleSheet(
                                                    sheet.name
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Accordion trigger */}
                                    <AccordionTrigger
                                        className="flex-1 py-4 min-w-0 text-left hover:no-underline"
                                    >
                                        <div className="flex flex-1 items-center gap-3 pr-2 min-w-0">
                                            <span className="min-w-0 font-medium truncate">
                                                {sheet.name}
                                            </span>

                                            <span className="ml-auto text-muted-foreground text-xs whitespace-nowrap shrink-0">
                                                {selectedCount} /{" "}
                                                {sheet.columns.length}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                </div>

                                <AccordionContent>
                                    <SpreadsheetColumnEditor
                                        sheet={sheet}
                                        onToggleColumn={(
                                            columnIndex
                                        ) =>
                                            onToggleColumn(
                                                sheet.name,
                                                columnIndex
                                            )
                                        }
                                        onRenameColumn={(
                                            columnIndex,
                                            key
                                        ) =>
                                            onRenameColumn(
                                                sheet.name,
                                                columnIndex,
                                                key
                                            )
                                        }
                                        onSelectAll={() =>
                                            onSelectAllColumns(
                                                sheet.name
                                            )
                                        }
                                        onDeselectAll={() =>
                                            onDeselectAllColumns(
                                                sheet.name
                                            )
                                        }
                                        onResetKeys={() =>
                                            onResetColumnKeys(
                                                sheet.name
                                            )
                                        }
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </CardContent>
        </Card>
    );
}