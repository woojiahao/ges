import { OverallEmploymentRateChart } from "@/components/charts/line-chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import survey from "@/data/survey_2024.json";
import { SurveyDataTable } from "@/survey/data-table";
import { type SurveyEntry } from "@/survey/entry";
import { useMemo } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

function App() {
  const surveyData: SurveyEntry[] = useMemo(() => survey.map(entry => entry as SurveyEntry), []);

  return (
    <div className="container my-12 mx-auto flex flex-col gap-4">
      <div>
        <h1 className="font-bold text-center text-4xl mb-3">Graduate Employment Survey</h1>
        <p className="text-lg text-center italic text-gray-500">Data taken from <a className="underline" href="https://data.gov.sg/datasets?topics=education&resultId=d_3c55210de27fcccda2ed0c63fdd2b352&page=1">data.gov.sg</a></p>
      </div>
      <Alert>
        <FaTriangleExclamation />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          The salary should not be the only metric you use to decide whether you join a major! You should consider your interest and alignment with the content taught.
        </AlertDescription>
      </Alert>
      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>
        <TabsContent value="data">
          <SurveyDataTable surveyData={surveyData} />
        </TabsContent>
        <TabsContent value="visualization">
          <OverallEmploymentRateChart years={[]} />
        </TabsContent>
      </Tabs>
      <footer className="text-center">
        <span className="italic">ges</span> was created by <a className="underline" href="https://blog.woojiahao.com">Jiahao</a> for the sake of playing with <a className="underline" href="https://ui.shadcn.com/">shadcn</a>. Check out the repository <a className="underline" href="https://github.com/woojiahao/ges">here</a>.
      </footer>
    </div>
  )
}

export default App
