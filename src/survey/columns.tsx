import { ColumnDef } from "@tanstack/react-table";

export interface SurveyEntry {
  year: number;
  university: string;
  school: string;
  degree: string;
  employment_rate_overall: number;
  employment_rate_ft_perm: number;
  basic_monthly_mean: number;
  basic_monthly_median: number;
  gross_monthly_mean: number;
  gross_monthly_median: number;
  gross_mthly_25_percentile: number;
  gross_mthly_75_percentile: number;
}

export const columns: ColumnDef<SurveyEntry>[] = [
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "university",
    header: "University",
  },
  {
    accessorKey: "school",
    header: "School",
  },
  {
    accessorKey: "degree",
    header: "Degree",
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
