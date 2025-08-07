import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <main className="w-full flex flex-col justify-center items-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </main>
      <aside className="hidden md:block relative h-screen">
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