import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OnboardingStepProps } from "./AddressStep";

const formSchema = z.object({
  name: z.string().min(2, "Beneficiary name is required"),
  relationship: z.string().min(2, "Relationship is required"),
});

export const BeneficiaryStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData.beneficiary || {},
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFormData({ beneficiary: data });
    nextStep();
  };

  const onSkip = () => {
    updateFormData({ beneficiary: null });
    nextStep();
  }

  return (
    <StepContainer title="Add a Beneficiary" description="You can add a beneficiary to your account. This is optional." onNext={form.handleSubmit(onSubmit)} onBack={prevStep} nextText="Add & Continue">
      <Form {...form}>
        <div className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="relationship" render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl><Input placeholder="Spouse" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </Form>
    </StepContainer>
  );
};