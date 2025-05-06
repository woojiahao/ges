import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SurveyEntry } from "@/survey/entry";
import { ColumnDef, ColumnFiltersState, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, Table as ReactTable, Row, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Funnel } from "lucide-react";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import { FaEye } from "react-icons/fa6";

const multiSelectFilterFn: FilterFn<SurveyEntry> = <TFilterType,>(row: Row<SurveyEntry>, columnId: string, filterValue: TFilterType[]): boolean => {
  return filterValue.includes(row.getValue(columnId));
}

const columns: ColumnDef<SurveyEntry>[] = [
  {
    accessorKey: "year",
    header: "Year",
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "university",
    header: "University",
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "school",
    header: "School",
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "degree",
    header: "Degree",
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "employment_rate_overall",
    header: "Overall Employment Rate (%)",
  },
  {
    accessorKey: "employment_rate_ft_perm",
    header: "Full-Time Permanent Employment Rate (%)",
  },
  {
    accessorKey: "basic_monthly_mean",
    header: "Basic Monthly Salary - Mean (S$)",
  },
  {
    accessorKey: "basic_monthly_median",
    header: "Basic Monthly Salary - Median (S$)",
  },
  {
    accessorKey: "gross_monthly_mean",
    header: "Gross Monthly Salary - Mean (S$)",
  },
  {
    accessorKey: "gross_monthly_median",
    header: "Gross Monthly Salary - Median (S$)",
  },
  {
    accessorKey: "gross_mthly_25_percentile",
    header: "Gross Monthly Salary - 25th Percentile (S$)",
  },
  {
    accessorKey: "gross_mthly_75_percentile",
    header: "Gross Monthly Salary - 75th Percentile (S$)",
  },
]

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

  return (
    <div className="flex flex-row items-center gap-4">
      <YearSelect placeholder="Start year" value={startYear} setValue={setStartYear} all={years} />
      <p>to</p>
      <YearSelect placeholder="End year" value={endYear} setValue={setEndYear} minimum={startYear} all={years} />
    </div>
  )
}

interface SurveyDataTableProps {
  surveyData: SurveyEntry[]
}

export function SurveyDataTable({
  surveyData
}: SurveyDataTableProps) {
  const years = useMemo(() => {
    const distinctYears = new Set(surveyData.map(entry => entry.year));
    const sortedYears = Array.from(distinctYears).sort();
    return sortedYears;
  }, [surveyData]);

  const universities = useMemo(() => {
    const distinctUniversities = new Set(surveyData.map(entry => entry.university));
    const sortedUniversities = Array.from(distinctUniversities).sort();
    return sortedUniversities;
  }, [surveyData]);

  const schools = useMemo(() => {
    const distinctSchools = new Set(surveyData.map(entry => entry.school));
    const sortedSchools = Array.from(distinctSchools).sort();
    return sortedSchools;
  }, [surveyData]);

  const degrees = useMemo(() => {
    const distinctDegrees = new Set(surveyData.map(entry => entry.degree));
    const sortedDegrees = Array.from(distinctDegrees).sort();
    return sortedDegrees;
  }, [surveyData]);

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

  const table = useReactTable<SurveyEntry>({
    data: surveyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: {
      multiSelectFilterFn,
    },
    state: {
      columnFilters,
      columnVisibility
    }
  })

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
