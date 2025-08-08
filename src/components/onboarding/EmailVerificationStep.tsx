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
  const [codeSent, setCodeSent] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const email = formData.basicInfo?.email || "your email";
  const userId = formData.userId;

  const handleSendCode = async () => {
    if (!userId) {
      showError("User session not found. Please go back to the previous step.");
      return;
    }
    setIsSubmitting(true);

    const { error: recordInsertError } = await supabase
      .from('device_verifications')
      .upsert({
        user_id: userId,
        signup_id: formData.signupId,
        type: 'email',
        is_verified: false,
      }, { onConflict: 'user_id,signup_id,type' });

    if (recordInsertError) {
      showError(`Could not initiate verification: ${recordInsertError.message}`);
      setIsSubmitting(false);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({ email });
    
    setIsSubmitting(false);

    if (otpError) {
      showError(`Could not send verification code: ${otpError.message}`);
    } else {
      showSuccess(`A verification code has been sent to ${email}`);
      setCodeSent(true);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: data.code,
      type: 'email',
    });

    if (verifyError) {
      showError(verifyError.message);
      form.setError("code", { type: "manual", message: verifyError.message });
      setIsSubmitting(false);
      return;
    }
    
    const user = verifyData.user;
    if (!user) {
      showError("Could not find user after verification.");
      setIsSubmitting(false);
      return;
    }

    const { error: recordUpdateError } = await supabase
      .from('device_verifications')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('signup_id', formData.signupId)
      .eq('type', 'email');

    if (recordUpdateError) {
      showError(`Failed to record email verification: ${recordUpdateError.message}`);
    } else {
      showSuccess("Email verified successfully!");
      nextStep();
    }
    setIsSubmitting(false);
  };

  return (
    <StepContainer 
      title="Verify Your Email" 
      description={!codeSent ? `Click the button to send a 6-digit verification code to ${email}.` : `We've sent a verification code to ${email}. Please enter it below.`} 
      onNext={codeSent ? form.handleSubmit(onSubmit) : handleSendCode} 
      onBack={prevStep} 
      nextText={codeSent ? "Verify & Continue" : "Send Code"} 
      isSubmitting={isSubmitting}
    >
      {codeSent && (
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
            <Button type="button" variant="link" onClick={handleSendCode}>
              Didn't receive a code? Resend
            </Button>
          </div>
        </Form>
      )}
    </StepContainer>
  );
};