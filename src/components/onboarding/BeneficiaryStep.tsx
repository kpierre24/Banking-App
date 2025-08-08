import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OnboardingStepProps } from "./AddressStep";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

const formSchema = z.object({
  name: z.string().min(2, "Beneficiary name is required"),
  relationship: z.string().min(2, "Relationship is required"),
});

export const BeneficiaryStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData.beneficiary || {},
  });

  const saveBeneficiary = async (data: z.infer<typeof formSchema> | null) => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("You must be logged in to continue.");
      setIsSubmitting(false);
      return;
    }

    if (data) {
      const { error } = await supabase.from('beneficiaries').insert({
        user_id: user.id,
        signup_id: formData.signupId,
        name: data.name,
        relationship: data.relationship,
      });

      if (error) {
        showError(`Failed to save beneficiary: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
    }
    
    updateFormData({ beneficiary: data });
    nextStep();
    setIsSubmitting(false);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    saveBeneficiary(data);
  };

  const onSkip = () => {
    saveBeneficiary(null);
  }

  return (
    <StepContainer title="Add a Beneficiary" description="You can add a beneficiary to your account. This is optional." onNext={form.handleSubmit(onSubmit)} onBack={prevStep} nextText="Add & Continue" isSubmitting={isSubmitting}>
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