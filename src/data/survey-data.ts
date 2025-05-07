import { SurveyEntry } from "@/data/survey-entry";
import survey from "@/data/survey_2024.json";

export const surveyData: SurveyEntry[] = survey.map(entry => entry as SurveyEntry);

export const years = (() => {
  const distinctYears = new Set(surveyData.map(entry => entry.year));
  const sortedYears = Array.from(distinctYears).sort();
  return sortedYears;
})();

export const universities = (() => {
  const distinctUniversities = new Set(surveyData.map(entry => entry.university.replaceAll("\n", " ")));
  const sortedUniversities = Array.from(distinctUniversities).sort();
  return sortedUniversities;
})();

export const schools = (() => {
  const distinctSchools = new Set(surveyData.map(entry => entry.school.replaceAll("\n", " ")));
  const sortedSchools = Array.from(distinctSchools).sort();
  return sortedSchools;
})();

export const degrees = (() => {
  const distinctDegrees = new Set(surveyData.map(entry => entry.degree.replaceAll("\n", " ")));
  const sortedDegrees = Array.from(distinctDegrees).sort();
  return sortedDegrees;
})();

export const fields = [
]
