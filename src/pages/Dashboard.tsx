import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome!</CardTitle>
            <CardDescription className="pt-2">
              You have successfully logged in.
            </Description>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleLogout} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;