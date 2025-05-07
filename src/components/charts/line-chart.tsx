import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
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
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-5))",
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
  console.log(chartData)
  console.log(Math.min(...chartData.map(d => d.data)) - 15)

  return (
    <Card className="w-full max-h-1/3">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              dataKey="data"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              domain={[Math.max(0, Math.min(...chartData.map(d => d.data)) - 5), Math.min(100, Math.max(...chartData.map(d => d.data)) + 5)]}
            />
            <XAxis
              dataKey="year"
              label="Year"
              tickLine={true}
              axisLine={true}
              tickMargin={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="data"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

