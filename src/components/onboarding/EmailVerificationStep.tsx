import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { OnboardingStepProps } from "./AddressStep";
import { Button } from "../ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  code: z.string().min(6, "Verification code must be 6 characters."),
});

export const EmailVerificationStep = ({ formData, nextStep, prevStep }: OnboardingStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const email = formData.basicInfo?.email || "your email";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: data.code,
      type: 'signup',
    });

    if (verifyError) {
      showError(verifyError.message);
      form.setError("code", { type: "manual", message: verifyError.message });
      setIsSubmitting(false);
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("Could not find user after verification.");
      setIsSubmitting(false);
      return;
    }

    const { error: recordError } = await supabase.from('device_verifications').insert({
      user_id: user.id,
      signup_id: formData.signupId,
      type: 'email',
      is_verified: true,
      verified_at: new Date().toISOString(),
    });

    if (recordError) {
      showError(`Failed to record email verification: ${recordError.message}`);
    } else {
      showSuccess("Email verified successfully!");
      nextStep();
    }
    setIsSubmitting(false);
  };

  const handleResendCode = async () => {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
    });
    if (error) {
        showError(error.message);
    } else {
        showSuccess(`A new verification code has been sent to ${email}`);
    }
  };

  return (
    <StepContainer title="Verify Your Email" description={`We've sent a verification code to ${email}. Please enter it below.`} onNext={form.handleSubmit(onSubmit)} onBack={prevStep} nextText="Verify & Continue" isSubmitting={isSubmitting}>
      <Form {...form}>
        <div className="flex flex-col items-center space-y-6">
          <FormField control={form.control} name="code" render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Enter the 6-digit code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" variant="link" onClick={handleResendCode}>
            Didn't receive a code? Resend
          </Button>
        </div>
      </Form>
    </StepContainer>
  );
};