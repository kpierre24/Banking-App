import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const SuccessStep = ({ reset }: { reset: () => void }) => {
  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle>Application Submitted!</CardTitle>
        <CardDescription>Thank you! Your application has been successfully submitted. We will review it and get back to you within 3-5 business days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset}>Start New Application</Button>
      </CardContent>
    </Card>
  );
};