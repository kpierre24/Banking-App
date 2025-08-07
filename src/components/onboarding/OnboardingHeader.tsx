import { Banknote } from "lucide-react";

export const OnboardingHeader = () => {
  return (
    <div className="flex w-full items-center gap-4 mb-8">
      <Banknote className="h-10 w-10 text-primary" />
      <h1 className="text-3xl font-bold tracking-tight">New Bank Account</h1>
    </div>
  );
};