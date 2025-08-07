import usePersistentState from "@/hooks/usePersistentState";
import { BasicInformationStep } from "@/components/onboarding/BasicInformationStep";
import { AddressStep } from "@/components/onboarding/AddressStep";
import { IdInformationStep } from "@/components/onboarding/IdInformationStep";
import { YesNoQuestionStep } from "@/components/onboarding/YesNoQuestionStep";
import { BeneficiaryStep } from "@/components/onboarding/BeneficiaryStep";
import { MembershipDeclarationStep } from "@/components/onboarding/MembershipDeclarationStep";
import { ReviewStep } from "@/components/onboarding/ReviewStep";
import { SuccessStep } from "@/components/onboarding/SuccessStep";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { MainLayout } from "@/components/layout/MainLayout";
import { CustomerTypeStep } from "@/components/onboarding/CustomerTypeStep";
import { showError } from "@/utils/toast";

const stepNames = [
  "Basic Info",
  "Address",
  "ID Info",
  "PEP",
  "Foreign National",
  "Power of Attorney",
  "Beneficiary",
  "Declaration",
  "Review",
];

const TOTAL_STEPS = stepNames.length;

const Index = () => {
  const [customerType, setCustomerType] = usePersistentState<'new' | 'existing' | null>('customerType', null);
  const [step, setStep] = usePersistentState("onboardingStep", 1);
  const [formData, setFormData] = usePersistentState("onboardingFormData", {});

  const handleCustomerTypeSelect = (type: 'new' | 'existing') => {
    if (type === 'existing') {
      showError("The existing customer flow is not yet implemented.");
      return;
    }
    setCustomerType(type);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (stepNumber: number) => {
    if (stepNumber <= step) {
      setStep(stepNumber);
    }
  };
  
  const reset = () => {
    setStep(1);
    setFormData({});
    setCustomerType(null);
  }

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const submitApplication = () => {
    console.log("Submitting application:", formData);
    nextStep();
  };

  const renderStep = () => {
    const props = { formData, updateFormData, nextStep, prevStep };
    switch (step) {
      case 1:
        return <BasicInformationStep {...props} nextStep={() => { updateFormData(formData); nextStep(); }} />;
      case 2:
        return <AddressStep {...props} />;
      case 3:
        return <IdInformationStep {...props} />;
      case 4:
        return <YesNoQuestionStep {...props} title="Politically Exposed Person" description="Please answer the following question." question="Are you or an immediate family member a Politically Exposed Person (PEP)?" formKey="pep" />;
      case 5:
        return <YesNoQuestionStep {...props} title="Foreign National Status" description="Please answer the following question." question="Are you a foreign national?" formKey="foreignNational" />;
      case 6:
        return <YesNoQuestionStep {...props} title="Power of Attorney" description="Please answer the following question." question="Do you wish to grant Power of Attorney on this account?" formKey="poa" />;
      case 7:
        return <BeneficiaryStep {...props} />;
      case 8:
        return <MembershipDeclarationStep {...props} />;
      case 9:
        return <ReviewStep formData={formData} prevStep={prevStep} goToStep={goToStep} submit={submitApplication} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  const renderOnboardingContent = () => {
    if (step > TOTAL_STEPS) {
      return <SuccessStep reset={reset} />;
    }
    return (
      <>
        <OnboardingHeader />
        <OnboardingStepper currentStep={step} totalSteps={TOTAL_STEPS} />
        <div className="mt-8 w-full">
          {renderStep()}
        </div>
      </>
    );
  };

  return (
    <MainLayout>
      {!customerType ? (
        <CustomerTypeStep onSelect={handleCustomerTypeSelect} />
      ) : (
        renderOnboardingContent()
      )}
    </MainLayout>
  );
};

export default Index;