import { multiSelectFilterFn } from "@/components/survey/filters";
import { Button } from "@/components/ui/button";
import { SurveyEntry } from "@/data/survey-entry";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<SurveyEntry>[] = [
  {
    accessorKey: "year",
    filterFn: multiSelectFilterFn,
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <span>Year</span>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
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
