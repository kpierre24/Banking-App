import { Suspense, lazy, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePersistentState from "@/hooks/usePersistentState";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

const GettingReadyStep = lazy(() => import('@/components/onboarding/GettingReadyStep').then(module => ({ default: module.GettingReadyStep })));
const BasicInformationStep = lazy(() => import('@/components/onboarding/BasicInformationStep').then(module => ({ default: module.BasicInformationStep })));
const EmailVerificationStep = lazy(() => import('@/components/onboarding/EmailVerificationStep').then(module => ({ default: module.EmailVerificationStep })));
const MobileVerificationStep = lazy(() => import('@/components/onboarding/MobileVerificationStep').then(module => ({ default: module.MobileVerificationStep })));
const AddressStep = lazy(() => import('@/components/onboarding/AddressStep').then(module => ({ default: module.AddressStep })));
const EmploymentInformationStep = lazy(() => import('@/components/onboarding/EmploymentInformationStep').then(module => ({ default: module.EmploymentInformationStep })));
const IdInformationStep = lazy(() => import('@/components/onboarding/IdInformationStep').then(module => ({ default: module.IdInformationStep })));
const YesNoQuestionStep = lazy(() => import('@/components/onboarding/YesNoQuestionStep').then(module => ({ default: module.YesNoQuestionStep })));
const BeneficiaryStep = lazy(() => import('@/components/onboarding/BeneficiaryStep').then(module => ({ default: module.BeneficiaryStep })));
const MembershipDeclarationStep = lazy(() => import('@/components/onboarding/MembershipDeclarationStep').then(module => ({ default: module.MembershipDeclarationStep })));
const ReviewStep = lazy(() => import('@/components/onboarding/ReviewStep').then(module => ({ default: module.ReviewStep })));
const SuccessStep = lazy(() => import('@/components/onboarding/SuccessStep').then(module => ({ default: module.SuccessStep })));
const CustomerTypeStep = lazy(() => import('@/components/onboarding/CustomerTypeStep').then(module => ({ default: module.CustomerTypeStep })));
const ResumeSessionPrompt = lazy(() => import('@/components/onboarding/ResumeSessionPrompt').then(module => ({ default: module.ResumeSessionPrompt })));

const stepNames = [
  "Getting Ready",
  "Basic Info",
  "Email Verification",
  "Mobile Verification",
  "Address",
  "Employment Info",
  "ID Info",
  "PEP",
  "Foreign National",
  "Power of Attorney",
  "Beneficiary",
  "Declaration",
  "Review",
];

const TOTAL_STEPS = stepNames.length;

const StepLoadingSkeleton = () => (
  <div className="w-full space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [customerType, setCustomerType] = usePersistentState<'new' | 'existing' | null>('customerType', null);
  const [step, setStep] = usePersistentState("onboardingStep", 1);
  const [formData, setFormData] = usePersistentState("onboardingFormData", {});
  const [promptState, setPromptState] = useState<'checking' | 'prompt' | 'active'>('checking');

  useEffect(() => {
    const hasSavedData = Object.keys(formData).length > 0 && formData.signupId;
    if (hasSavedData) {
      // Also check if the user is still logged in for that session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user.id === formData.userId) {
          setPromptState('prompt');
        } else {
          // Clear invalid session data
          startNewSession(false);
          setPromptState('active');
        }
      });
    } else {
      setPromptState('active');
    }
  }, []);

  const startNewSession = (clearCustomerType = true) => {
    const newSignupId = `signup_${Date.now()}`;
    setFormData({ signupId: newSignupId });
    setStep(1);
    if (clearCustomerType) {
      setCustomerType(null);
    }
    setPromptState('active');
  };

  const handleResume = () => {
    setPromptState('active');
  };

  const handleStartNew = () => {
    startNewSession();
  };

  const handleCustomerTypeSelect = (type: 'new' | 'existing') => {
    if (type === 'existing') {
      navigate('/');
      return;
    }
    if (!formData.signupId) {
      const newSignupId = `signup_${Date.now()}`;
      setFormData({ signupId: newSignupId });
    }
    setCustomerType(type);
    setStep(1);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const goBackToCustomerType = () => {
    setCustomerType(null);
  }

  const goToStep = (stepNumber: number) => {
    if (stepNumber <= step) {
      setStep(stepNumber);
    }
  };
  
  const reset = () => {
    startNewSession();
  }

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const submitApplication = () => {
    console.log("Finalizing application for signup ID:", formData.signupId);
    // Data is already saved incrementally. This is the final step.
    nextStep();
  };

  const renderStep = () => {
    const props = { formData, updateFormData, nextStep, prevStep };
    switch (step) {
      case 1:
        return <GettingReadyStep nextStep={nextStep} prevStep={goBackToCustomerType} />;
      case 2:
        return <BasicInformationStep {...props} />;
      case 3:
        return <EmailVerificationStep {...props} />;
      case 4:
        return <MobileVerificationStep {...props} />;
      case 5:
        return <AddressStep {...props} />;
      case 6:
        return <EmploymentInformationStep {...props} />;
      case 7:
        return <IdInformationStep {...props} />;
      case 8:
        return <YesNoQuestionStep {...props} title="Politically Exposed Person" description="Please answer the following question." question="Are you or an immediate family member a Politically Exposed Person (PEP)?" formKey="pep" />;
      case 9:
        return <YesNoQuestionStep {...props} title="Foreign National Status" description="Please answer the following question." question="Are you a foreign national?" formKey="foreignNational" />;
      case 10:
        return <YesNoQuestionStep {...props} title="Power of Attorney" description="Please answer the following question." question="Do you wish to grant Power of Attorney on this account?" formKey="poa" />;
      case 11:
        return <BeneficiaryStep {...props} />;
      case 12:
        return <MembershipDeclarationStep {...props} />;
      case 13:
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

  const renderPageContent = () => {
    if (promptState === 'checking') {
      return <StepLoadingSkeleton />;
    }
    if (promptState === 'prompt') {
      return <ResumeSessionPrompt onResume={handleResume} onStartNew={handleStartNew} />;
    }
    if (!customerType) {
      return <CustomerTypeStep onSelect={handleCustomerTypeSelect} />;
    }
    return renderOnboardingContent();
  };

  return (
    <MainLayout>
      <Suspense fallback={<StepLoadingSkeleton />}>
        {renderPageContent()}
      </Suspense>
    </MainLayout>
  );
};

export default SignupPage;