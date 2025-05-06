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

export const SURVEY_METRICS = [
  'employment_rate_overall',
  'employment_rate_ft_perm',
  'basic_monthly_mean',
  'basic_monthly_median',
  'gross_monthly_mean',
  'gross_monthly_median',
  'gross_mthly_25_percentile',
  'gross_mthly_75_percentile',
] as const;
