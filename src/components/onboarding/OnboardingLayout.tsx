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
        <img src="/placeholder.svg" alt="Brand" className="max-w-xs h-auto" />
      </div>
    </div>
  );
};