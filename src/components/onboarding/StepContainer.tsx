import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StepContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextText?: string;
  backText?: string;
  isSubmitting?: boolean;
}

export const StepContainer = ({ title, description, children, onNext, onBack, nextText = "Next", backText = "Back", isSubmitting }: StepContainerProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter className="flex justify-between">
          {onBack ? (
            <Button type="button" className="bg-brand-secondary hover:bg-brand-secondary/90 text-white" onClick={onBack}>
              {backText}
            </Button>
          ) : <div />}
          <Button type="submit" disabled={isSubmitting} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
            {nextText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};