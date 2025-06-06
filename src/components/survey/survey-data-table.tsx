import { ColumnVisibilityDropdown } from "@/components/survey/column-visibility-dropdown";
import { columns } from "@/components/survey/columns";
import { FilterDropdown } from "@/components/survey/filter-dropdown";
import { multiSelectFilterFn } from "@/components/survey/filters";
import { YearRangeInput } from "@/components/survey/year-range-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { degrees, schools, surveyData, universities, years } from "@/data/survey-data";
import { SurveyEntry } from "@/data/survey-entry";
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";

export function SurveyDataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "year",
      value: years,
    },
    {
      id: "university",
      value: universities,
    },
    {
      id: "school",
      value: schools,
    },
    {
      id: "degree",
      value: degrees,
    },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable<SurveyEntry>({
    data: surveyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      multiSelectFilterFn,
    },
    state: {
      columnFilters,
      columnVisibility,
      sorting,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Data</CardTitle>
        <CardDescription>View the results of the GES survey from 2013 to 2023</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center py-4">
          <div className="flex flex-row gap-4">
            <YearRangeInput table={table} years={years} />
            <FilterDropdown table={table} columnId="university" available={universities} />
            <FilterDropdown table={table} columnId="school" available={schools} />
            <FilterDropdown table={table} columnId="degree" available={degrees} />
          </div>
          <ColumnVisibilityDropdown table={table} />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
