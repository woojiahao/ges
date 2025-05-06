import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SurveyEntry } from "@/survey/entry";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { Funnel } from "lucide-react";
import React, { Key, useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";

function ColumnVisibilityDropdown({ table }: { table: ReactTable<SurveyEntry> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Column Visibility <FaEye />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter(
            (column) => column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu >
  )
}

function FilterDropdown<TFilterType extends Key>({ table, columnId, available }: { table: ReactTable<SurveyEntry>, columnId: string, available: TFilterType[] }) {
  const getFilterValue = useCallback(() => {
    return (table.getColumn(columnId)?.getFilterValue() ?? []) as TFilterType[]
  }, [columnId, table]);

  const toggleFilter = useCallback((value: TFilterType) => () => {
    const yearFilterValue = getFilterValue();
    const updatedYearFilterValue =
      yearFilterValue.includes(value) ?
        yearFilterValue.filter(y => y !== value) :
        [...yearFilterValue, value]
    table.getColumn(columnId)?.setFilterValue(updatedYearFilterValue);
  }, [getFilterValue, table, columnId])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {table.getColumn(columnId)?.columnDef.header?.toString()} <Funnel size={8} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {
          available.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              className="capitalize"
              checked={getFilterValue().includes(value)}
              onCheckedChange={toggleFilter(value)}>
              {value}
            </DropdownMenuCheckboxItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function YearSelect({
  placeholder,
  value,
  setValue,
  all,
  minimum,
}: {
  placeholder: string,
  value: number,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  all: number[],
  minimum?: number,
}) {
  const selectYear = useCallback((value: string) => {
    setValue(parseInt(value));
  }, [setValue])

  return (
    <Select value={value.toString()} onValueChange={selectYear}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {all.map(year => (
          <SelectItem
            key={year}
            disabled={minimum != null && year < minimum}
            value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function YearRangeInput({ table, years }: { table: ReactTable<SurveyEntry>, years: number[] }) {
  const [startYear, setStartYear] = useState<number>(years[0]);
  const [endYear, setEndYear] = useState<number>(years[years.length - 1]);

  useEffect(() => {
    table.getColumn("year")?.setFilterValue(Array.from(Array(endYear - startYear + 1).keys()).map(y => y + startYear))
  }, [table, startYear, endYear])

  useEffect(() => {
    console.log(table.getColumn("year")?.getFilterValue())
  }, [table])

  return (
    <div className="flex flex-row items-center gap-4">
      <YearSelect placeholder="Start year" value={startYear} setValue={setStartYear} all={years} />
      <p>to</p>
      <YearSelect placeholder="End year" value={endYear} setValue={setEndYear} minimum={startYear} all={years} />
    </div>
  )
}

interface SurveyDataTableProps {
  table: ReactTable<SurveyEntry>;
  years: number[];
  universities: string[];
  schools: string[];
  degrees: string[];
}

export function SurveyDataTable({
  table,
  years,
  universities,
  schools,
  degrees,
}: SurveyDataTableProps) {
  return (
    <div>
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
    </div>
  )
}
