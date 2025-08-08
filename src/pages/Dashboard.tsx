import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome!</CardTitle>
            <CardDescription className="pt-2">
              You have successfully logged in.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Link to="/">Log Out</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;