import { GESChart } from "@/components/charts/ges-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SURVEY_METRICS } from "@/data/survey-entry";
import { useCallback, useState } from "react";
import { ChartBuilderForm, ChartBuilderFormSchemaType } from "./chart-builder-form";

export function ChartBuilder() {
  const [chartConfig, setChartConfig] = useState<ChartBuilderFormSchemaType>();
  const [showChart, setShowChart] = useState(false);

  const createChart = useCallback((values: ChartBuilderFormSchemaType) => {
    setShowChart(false);
    setChartConfig(values)
    setShowChart(true);
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Builder</CardTitle>
        <CardDescription>
          Plot trends of certain statistics from the GES
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ChartBuilderForm submitForm={createChart} />
        {showChart && chartConfig != null && (
          <GESChart metric={chartConfig.metric as unknown as typeof SURVEY_METRICS} university={chartConfig.university} degree={chartConfig.degree} />
        )}
      </CardContent>
    </Card>
  )
}
