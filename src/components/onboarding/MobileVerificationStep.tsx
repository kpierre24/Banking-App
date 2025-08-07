import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { OnboardingStepProps } from "./AddressStep";
import { Button } from "../ui/button";
import { showSuccess } from "@/utils/toast";

const formSchema = z.object({
  code: z.string().min(6, "Verification code must be 6 characters."),
});

// In a real app, this would be a call to your backend.
const MOCK_CORRECT_CODE = "654321";

export const MobileVerificationStep = ({ formData, nextStep, prevStep }: OnboardingStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const mobileNumber = formData.basicInfo?.mobileNumber || "your mobile number";

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.code === MOCK_CORRECT_CODE) {
      showSuccess("Mobile number verified successfully!");
      nextStep();
    } else {
      form.setError("code", {
        type: "manual",
        message: "Incorrect verification code. Please try again.",
      });
    }
  };

  const handleResendCode = () => {
    // In a real app, this would trigger a backend API call.
    showSuccess(`A new verification code has been sent to ${mobileNumber}`);
  };

  return (
    <StepContainer title="Verify Your Mobile Number" description={`We've sent a verification code to ${mobileNumber}. Please enter it below.`} onNext={form.handleSubmit(onSubmit)} onBack={prevStep} nextText="Verify & Continue">
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
                Enter the 6-digit code sent to your mobile.
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