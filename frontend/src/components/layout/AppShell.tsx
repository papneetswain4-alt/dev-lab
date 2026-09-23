import React from 'react';
import { BackgroundVideo } from './BackgroundVideo';
import { Navbar } from './Navbar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full text-foreground flex flex-col">
      {/* Global Persistent Video Background */}
      <BackgroundVideo />

      {/* Persistent Navigation */}
      <Navbar />

      {/* Application Route Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
