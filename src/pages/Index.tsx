import { useState } from "react";
import { BasicInformationStep } from "@/components/onboarding/BasicInformationStep";
import { AddressStep } from "@/components/onboarding/AddressStep";
import { YesNoQuestionStep } from "@/components/onboarding/YesNoQuestionStep";
import { BeneficiaryStep } from "@/components/onboarding/BeneficiaryStep";
import { MembershipDeclarationStep } from "@/components/onboarding/MembershipDeclarationStep";
import { ReviewStep } from "@/components/onboarding/ReviewStep";
import { SuccessStep } from "@/components/onboarding/SuccessStep";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

const stepNames = [
  "Basic Info",
  "Address",
  "PEP",
  "Foreign National",
  "Power of Attorney",
  "Beneficiary",
  "Declaration",
  "Review",
];

const TOTAL_STEPS = stepNames.length;

const Index = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);
  const reset = () => {
    setStep(1);
    setFormData({});
  }

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const submitApplication = () => {
    console.log("Submitting application:", formData);
    // Here you would typically send the data to a server
    nextStep();
  };

  const renderStep = () => {
    const props = { formData, updateFormData, nextStep, prevStep };
    switch (step) {
      case 1:
        return <BasicInformationStep {...props} />;
      case 2:
        return <AddressStep {...props} />;
      case 3:
        return <YesNoQuestionStep {...props} title="Politically Exposed Person" description="Please answer the following question." question="Are you or an immediate family member a Politically Exposed Person (PEP)?" formKey="pep" />;
      case 4:
        return <YesNoQuestionStep {...props} title="Foreign National Status" description="Please answer the following question." question="Are you a foreign national?" formKey="foreignNational" />;
      case 5:
        return <YesNoQuestionStep {...props} title="Power of Attorney" description="Please answer the following question." question="Do you wish to grant Power of Attorney on this account?" formKey="poa" />;
      case 6:
        return <BeneficiaryStep {...props} />;
      case 7:
        return <MembershipDeclarationStep {...props} />;
      case 8:
        return <ReviewStep formData={formData} prevStep={prevStep} goToStep={goToStep} submit={submitApplication} />;
      case 9:
        return <SuccessStep reset={reset} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <OnboardingHeader />
        {step <= TOTAL_STEPS && (
          <OnboardingStepper currentStep={step} totalSteps={TOTAL_STEPS} stepNames={stepNames} goToStep={goToStep} />
        )}
        <div className="mt-8 w-full">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Index;