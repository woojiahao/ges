import { SurveyEntry } from "@/data/survey-entry";
import { FilterFn, Row } from "@tanstack/react-table";


export const multiSelectFilterFn: FilterFn<SurveyEntry> = <TFilterType,>(row: Row<SurveyEntry>, columnId: string, filterValue: TFilterType[]): boolean => {
  return filterValue.includes(row.getValue(columnId));
}
