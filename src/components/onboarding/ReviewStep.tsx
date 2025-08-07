import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { format } from "date-fns";

interface ReviewStepProps {
  formData: any;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submit: () => void;
}

const ReviewSection = ({ title, data, onEdit }: { title: string; data: any; onEdit: () => void }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
    <div className="text-sm text-muted-foreground space-y-1 bg-slate-50 p-3 rounded-md">
      {data ? Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
          <strong>{key === 'dateOfBirth' && value ? format(new Date(value as string), 'PPP') : String(value)}</strong>
        </div>
      )) : <p>Not provided.</p>}
    </div>
  </div>
);

const YesNoReviewSection = ({ title, data, onEdit }: { title: string; data: any; onEdit: () => void }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground space-y-1 bg-slate-50 p-3 rounded-md">
        <div className="flex justify-between">
            <span>Answer</span>
            <strong>{data?.answer?.toUpperCase() || 'N/A'}</strong>
        </div>
      </div>
    </div>
  );

const IdReviewSubSection = ({ title, data }: { title: string, data: any }) => {
  if (!data) return null;
  return (
    <div className="text-sm text-muted-foreground space-y-1 bg-slate-50 p-3 rounded-md">
      <h4 className="font-medium text-primary mb-2">{title}</h4>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
          <strong>{key === 'expiryDate' && value ? format(new Date(value as string), 'PPP') : String(value)}</strong>
        </div>
      ))}
    </div>
  );
};

export const ReviewStep = ({ formData, prevStep, goToStep, submit }: ReviewStepProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review Your Application</CardTitle>
        <CardDescription>Please review all the information carefully before submitting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReviewSection title="Basic Information" data={formData.basicInfo} onEdit={() => goToStep(1)} />
        <ReviewSection title="Address" data={formData.address} onEdit={() => goToStep(2)} />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">ID Information</h3>
            <Button variant="ghost" size="icon" onClick={() => goToStep(3)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <IdReviewSubSection title="First ID Document" data={formData.idInfo?.firstId} />
            <IdReviewSubSection title="Second ID Document" data={formData.idInfo?.secondId} />
            {!formData.idInfo && <div className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-md"><p>Not provided.</p></div>}
          </div>
        </div>

        <YesNoReviewSection title="Politically Exposed Person" data={formData.pep} onEdit={() => goToStep(4)} />
        <YesNoReviewSection title="Foreign National" data={formData.foreignNational} onEdit={() => goToStep(5)} />
        <YesNoReviewSection title="Power of Attorney" data={formData.poa} onEdit={() => goToStep(6)} />
        <ReviewSection title="Beneficiary" data={formData.beneficiary} onEdit={() => goToStep(7)} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={submit}>Submit Application</Button>
      </CardFooter>
    </Card>
  );
};