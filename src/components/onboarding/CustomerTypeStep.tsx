import { Button } from "@/components/ui/button";

interface CustomerTypeStepProps {
  onSelect: (type: 'new' | 'existing') => void;
}

export const CustomerTypeStep = ({ onSelect }: CustomerTypeStepProps) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto">
      <img src="/cathedral-engage-logo.svg" alt="Cathedral Engage Logo" className="h-12 mb-8" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Cathedral Engage</h1>
      <p className="text-gray-600 mb-8">Are you a new or existing customer?</p>
      
      <div className="w-full space-y-4">
        <Button 
          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-6 text-lg"
          onClick={() => onSelect('new')}
        >
          New Customer
        </Button>
        <Button 
          className="w-full bg-brand-secondary hover:bg-brand-secondary/90 text-white py-6 text-lg"
          onClick={() => onSelect('existing')}
        >
          Existing Customer
        </Button>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-2">Powered by</p>
        <img src="/credit-union-logo.svg" alt="Cathedral Credit Union Logo" className="h-10 mx-auto" />
      </div>
    </div>
  );
};