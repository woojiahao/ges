import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import survey from "@/data/survey_2024.json";
import { SurveyDataTable } from "@/survey/data-table";
import { type SurveyEntry } from "@/survey/entry";
import { ColumnDef, ColumnFiltersState, FilterFn, Row, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

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

function App() {
  const surveyData: SurveyEntry[] = useMemo(() => survey.map(entry => entry as SurveyEntry), []);
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
    <div className="container my-12 mx-auto flex flex-col gap-8">
      <Alert>
        <FaTriangleExclamation />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          The salary should not be the only metric you use to decide whether you join a major! You should consider your interest and alignment with the content taught.
        </AlertDescription>
      </Alert>

      <SurveyDataTable table={table} years={years} schools={schools} universities={universities} degrees={degrees} />
    </div>
  )
}

export default App
