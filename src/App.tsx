import survey from "@/data/survey_2024.json"
import { useMemo } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaTriangleExclamation } from "react-icons/fa6";
import { SurveyEntry } from "@/survey/entry";
import { SurveyDataTable } from "@/survey/data-table";
import { Component } from "@/components/charts/line-chart";

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

  const degree = useMemo(() => {
    const distinctDegrees = new Set(surveyData.map(entry => entry.degree));
    const sortedDegrees = Array.from(distinctDegrees).sort();
    return sortedDegrees;
  }, [surveyData]);

  return (
    <div className="container my-12 mx-auto flex flex-col gap-8">
      <Alert>
        <FaTriangleExclamation />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          The salary should not be the only metric you use to decide whether you join a major! You should consider your interest and alignment with the content taught.
        </AlertDescription>
      </Alert>

      <SurveyDataTable data={surveyData} />
    </div>
  )
}

export default App
