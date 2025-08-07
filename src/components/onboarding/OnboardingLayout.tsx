import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-16 items-start">
      <div className="w-full">
        {children}
      </div>
      <div className="hidden md:flex sticky top-8 w-full h-full items-center justify-center p-8 bg-gray-100 rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="A smiling woman" 
          className="w-full h-full object-cover rounded-lg" 
        />
      </div>
    </div>
  );
};