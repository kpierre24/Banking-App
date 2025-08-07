import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSquare, MapPin, Briefcase } from "lucide-react";

const formSchema = z.object({
  agreed: z.boolean().refine(val => val === true, {
    message: "You must confirm you have the required documents.",
  }),
});

interface GettingReadyStepProps {
  nextStep: () => void;
  prevStep: () => void;
}

const RequirementCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
      {icon}
      <CardTitle className="text-base font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const GettingReadyStep = ({ nextStep, prevStep }: GettingReadyStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { agreed: false },
  });

  const onSubmit = () => {
    nextStep();
  };

  return (
    <StepContainer title="Let's Get Started" description="Please ensure you have the following information and documents available." onNext={form.handleSubmit(onSubmit)} onBack={prevStep} nextText="Continue">
      <Form {...form}>
        <div className="space-y-4">
          <RequirementCard 
            icon={<UserSquare className="h-6 w-6 text-primary" />}
            title="Identification"
            description="You will need two forms of valid, government-issued ID (e.g., Passport, Driver's License, National ID card)."
          />
          <RequirementCard 
            icon={<MapPin className="h-6 w-6 text-primary" />}
            title="Proof of Address"
            description="A recent utility bill, bank statement, or lease agreement showing your current address."
          />
          <RequirementCard 
            icon={<Briefcase className="h-6 w-6 text-primary" />}
            title="Employment Information"
            description="Details about your current employment status, employer, and job title."
          />
          <FormField control={form.control} name="agreed" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I have all the required information and documents ready.</FormLabel>
              </div>
            </FormItem>
          )} />
        </div>
      </Form>
    </StepContainer>
  );
};