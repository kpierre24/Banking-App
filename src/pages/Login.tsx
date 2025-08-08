import { MainLayout } from "@/components/layout/MainLayout";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <LoginForm />
      </div>
    </MainLayout>
  );
};

export default LoginPage;