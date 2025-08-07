import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingStepProps } from "./AddressStep";

const formSchema = z.object({
  employmentStatus: z.enum(["Employed", "Self-Employed", "Unemployed", "Student", "Retired"], {
    required_error: "Please select your employment status.",
  }),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
}).refine(data => {
  if (data.employmentStatus === "Employed") {
    return !!data.employerName && !!data.jobTitle;
  }
  return true;
}, {
  message: "Employer name and job title are required.",
  path: ["employerName"], // You can choose which field to show the error on
});

export const EmploymentInformationStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData.employmentInfo || {},
  });

  const employmentStatus = useWatch({
    control: form.control,
    name: 'employmentStatus'
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData({ employmentInfo: data });
    nextStep();
  };

  return (
    <StepContainer title="Employment Information" description="Please provide your employment details." onNext={form.handleSubmit(onSubmit)} onBack={prevStep}>
      <Form {...form}>
        <div className="space-y-4">
          <FormField control={form.control} name="employmentStatus" render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {(employmentStatus === "Employed" || employmentStatus === "Self-Employed") && (
            <>
              <FormField control={form.control} name="employerName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{employmentStatus === "Employed" ? "Employer Name" : "Business Name"}</FormLabel>
                  <FormControl><Input placeholder={employmentStatus === "Employed" ? "ACME Inc." : "John Doe's Consulting"} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="jobTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}
        </div>
      </Form>
    </StepContainer>
  );
};