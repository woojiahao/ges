import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SurveyEntry } from "@/data/survey-entry";
import { Table } from "@tanstack/react-table";
import { Funnel } from "lucide-react";
import { Key, useCallback } from "react";

interface FilterDropdownProps<TFilterType extends Key> {
  table: Table<SurveyEntry>;
  columnId: string;
  available: TFilterType[];
}

export function FilterDropdown<TFilterType extends Key>({
  table,
  columnId,
  available
}: FilterDropdownProps<TFilterType>) {
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

