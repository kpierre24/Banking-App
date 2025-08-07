import { Progress } from "@/components/ui/progress";

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingStepper = ({ currentStep, totalSteps }: OnboardingStepperProps) => {
  // The progress should not be 100% until the review step is also complete.
  // We show progress for steps 1 to TOTAL_STEPS on a scale of TOTAL_STEPS.
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <Progress value={progressValue} />
    </div>
  );
};