'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === '/onboarding';

  if (isOnboarding) {
    return <main className="min-h-screen bg-[#f1f5f2]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#f1f5f2]">
      {/* Left Sage Green Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />
        <main className="flex-1 px-6 sm:px-8 pb-12 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

