import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { surveyData } from "@/data/survey-data"
import { SURVEY_METRICS, SurveyEntry } from "@/data/survey-entry"
import { useCallback, useMemo } from "react"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface GESChartProps {
  metric: typeof SURVEY_METRICS;
  university: string;
  degree: string;
}

export function GESChart({
  metric,
  university,
  degree,
}: GESChartProps) {
  const getMetricData = useCallback((entry: SurveyEntry) => {
    const value = entry[metric as unknown as keyof SurveyEntry]
    if (typeof value === "string" && value.endsWith("%")) {
      return parseInt(value.substring(0, value.length - 1))
    }
    return value as number
  }, [metric])

  const chartData = useMemo(() => {
    const filteredData = surveyData.filter((entry) => {
      return entry.university === university && entry.degree === degree
    }).map((entry) => {
      return {
        year: entry.year,
        data: getMetricData(entry),
      }
    });
    return filteredData
  }, [degree, getMetricData, university])

  const domain = useMemo(() => {
    const minData = Math.min(...chartData.map(d => d.data))
    const maxData = Math.max(...chartData.map(d => d.data))
    const limit = (metric as unknown as string === "employment_rate_overall" || metric as unknown as string === "employment_rate_ft_perm") ? 5 : 500;
    const upperBound = (metric as unknown as string === "employment_rate_overall" || metric as unknown as string === "employment_rate_ft_perm") ? 100 : 100_000;
    return [Math.max(0, minData - limit), Math.min(upperBound, maxData + limit)]
  }, [chartData, metric])

  return (
    <Card className="w-full max-h-1/3">
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center">No data found.</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={true} />
              <YAxis
                dataKey="data"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                label={{ value: "Data", position: "insideLeft", angle: -90, offset: 0 }}
                domain={domain}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent formatter={(v) => `Value: ${v}`} hideLabel />}
              />
              <XAxis
                dataKey="year"
                label={{ value: "Year", position: "insideBottom", offset: 0 }}
                tickLine={true}
                axisLine={true}
                tickMargin={0}
              />
              <Line
                dataKey="data"
                type="linear"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

