import { cn } from "@/lib/utils";

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
  goToStep: (step: number) => void;
}

export const OnboardingStepper = ({ currentStep, totalSteps, stepNames, goToStep }: OnboardingStepperProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0 mb-8">
        {stepNames.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={stepName} className="md:flex-1">
              <button
                onClick={() => isCompleted && goToStep(stepNumber)}
                disabled={!isCompleted}
                className={cn(
                  "group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  isCurrent ? "border-primary" : isCompleted ? "border-green-500 hover:border-green-600" : "border-gray-200 group-hover:border-gray-300"
                )}
              >
                <span className={cn("text-sm font-medium transition-colors", isCurrent ? "text-primary" : isCompleted ? "text-green-600" : "text-gray-500 group-hover:text-gray-700")}>
                  Step {stepNumber}
                </span>
                <span className="text-sm font-medium">{stepName}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};