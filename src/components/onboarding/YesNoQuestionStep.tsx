import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData[formKey] || {},
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("You must be logged in to continue.");
      setIsSubmitting(false);
      return;
    }

    const answerBoolean = data.answer === 'yes';
    let error;

    if (formKey === 'poa') {
      ({ error } = await supabase.from('power_of_attorneys').insert({
        user_id: user.id,
        signup_id: formData.signupId,
        has_power_of_attorney: answerBoolean,
      }));
    } else {
      ({ error } = await supabase.from('signup_questions').insert({
        user_id: user.id,
        signup_id: formData.signupId,
        question_key: formKey,
        answer: answerBoolean,
      }));
    }

    if (error) {
      showError(`Failed to save answer: ${error.message}`);
    } else {
      updateFormData({ [formKey]: data });
      nextStep();
    }
    setIsSubmitting(false);
  };

  return (
    <StepContainer title={title} description={description} onNext={form.handleSubmit(onSubmit)} onBack={prevStep} isSubmitting={isSubmitting}>
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