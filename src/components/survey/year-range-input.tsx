import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyEntry } from "@/data/survey-entry";
import { Table } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

interface YearSelectProps {
  placeholder: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  all: number[];
  minimum?: number;
}


function YearSelect({
  placeholder,
  value,
  setValue,
  all,
  minimum,
}: YearSelectProps) {
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

interface YearRangeInputProps {
  table: Table<SurveyEntry>;
  years: number[];
}

export function YearRangeInput({ table, years }: YearRangeInputProps) {
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
