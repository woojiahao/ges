import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { degrees, universities } from "@/data/survey-data";
import { SURVEY_METRICS } from "@/data/survey-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const chartBuilderFormSchema = z.object({
  metric: z.enum(SURVEY_METRICS),
  university: z.string().refine((v: string) => universities.includes(v), "Invalid university").optional(),
  degree: z.string().refine((v: string) => degrees.includes(v), "Invalid degree").optional(),
})
  .refine(({ university, degree }: { university?: string, degree?: string }) =>
    university || degree,
    {
      message: "At least 'university' or 'degree' must be provided",
      path: ["university"]
    }
  )
  .refine(({ university, degree }: { university?: string, degree?: string }) =>
    university || degree,
    {
      message: "At least 'university' or 'degree' must be provided",
      path: ["degree"]
    }
  )

export function ChartBuilder() {
  const form = useForm<z.infer<typeof chartBuilderFormSchema>>({
    resolver: zodResolver(chartBuilderFormSchema),
    defaultValues: {
      metric: SURVEY_METRICS[0],
    }
  })

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  const onSubmit = useCallback((values: z.infer<typeof chartBuilderFormSchema>) => {
    console.log("hi")
    console.log(values)
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Builder</CardTitle>
        <CardDescription>
          Plot trends of certain statistics from the GES. Include at least one of University or Degree
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="metric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a metric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SURVEY_METRICS.map(metric => (<SelectItem value={metric} key={metric}>{metric}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map(university => (<SelectItem value={university} key={university}>{university}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a degree" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {degrees.map(degree => (<SelectItem value={degree} key={degree}>{degree}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
