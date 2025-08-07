import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

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
          <strong>{String(value)}</strong>
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
        <YesNoReviewSection title="Politically Exposed Person" data={formData.pep} onEdit={() => goToStep(3)} />
        <YesNoReviewSection title="Foreign National" data={formData.foreignNational} onEdit={() => goToStep(4)} />
        <YesNoReviewSection title="Power of Attorney" data={formData.poa} onEdit={() => goToStep(5)} />
        <ReviewSection title="Beneficiary" data={formData.beneficiary} onEdit={() => goToStep(6)} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={submit}>Submit Application</Button>
      </CardFooter>
    </Card>
  );
};