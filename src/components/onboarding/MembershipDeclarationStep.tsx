import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingStepProps } from "./AddressStep";

const formSchema = z.object({
  agreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export const MembershipDeclarationStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { agreed: false },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData({ declaration: data });
    nextStep();
  };

  return (
    <StepContainer title="Membership Declaration" description="Please review and agree to the terms." onNext={form.handleSubmit(onSubmit)} onBack={prevStep} nextText="Agree & Continue">
      <Form {...form}>
        <div className="space-y-4">
          <div className="p-4 border rounded-md text-sm max-h-48 overflow-y-auto">
            <p>I hereby apply for membership in and agree to conform to the Bylaws and amendments of this financial institution. I certify that the information provided on this application is true and correct. I authorize the financial institution to verify the information provided and to obtain a credit report.</p>
          </div>
          <FormField control={form.control} name="agreed" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I have read and agree to the membership declaration.</FormLabel>
              </div>
            </FormItem>
          )} />
        </div>
      </Form>
    </StepContainer>
  );
};