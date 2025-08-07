import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  answer: z.enum(["yes", "no"], { required_error: "You must select an option." }),
});

interface YesNoQuestionStepProps {
  title: string;
  description: string;
  question: string;
  formData: any;
  updateFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  formKey: string;
}

export const YesNoQuestionStep = ({ title, description, question, formData, updateFormData, nextStep, prevStep, formKey }: YesNoQuestionStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData[formKey] || {},
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData({ [formKey]: data });
    nextStep();
  };

  return (
    <StepContainer title={title} description={description} onNext={form.handleSubmit(onSubmit)} onBack={prevStep}>
      <Form {...form}>
        <FormField control={form.control} name="answer" render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{question}</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="no" /></FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="yes" /></FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )} />
      </Form>
    </StepContainer>
  );
};