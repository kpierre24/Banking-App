import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Left side - scrollable form content */}
      <main className="w-full md:w-1/2 h-screen overflow-y-auto custom-scrollbar-hide">
        <div className="flex flex-col items-center justify-center min-h-full p-4 sm:p-8">
            <div className="w-full max-w-xl">
                {children}
            </div>
        </div>
      </main>

      {/* Right side - fixed image */}
      <aside className="hidden md:block fixed top-0 right-0 w-1/2 h-screen">
        <img 
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="A smiling woman" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-indigo-900 opacity-40"></div>
      </aside>
    </div>
  );
};