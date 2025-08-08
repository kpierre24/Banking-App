import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResumeSessionPromptProps {
  onResume: () => void;
  onStartNew: () => void;
}

export const ResumeSessionPrompt = ({ onResume, onStartNew }: ResumeSessionPromptProps) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Resume Application?</CardTitle>
        <CardDescription>
          It looks like you have a saved application in progress. Would you like to continue where you left off or start a new application?
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onStartNew}>Start New</Button>
        <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white" onClick={onResume}>Resume</Button>
      </CardFooter>
    </Card>
  );
};