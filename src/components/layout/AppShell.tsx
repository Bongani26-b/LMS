'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isPublicPage = pathname === '/login' || pathname === '/onboarding';

  useEffect(() => {
    if (!isLoading && !user && !isPublicPage) {
      router.replace('/login');
    }
  }, [isLoading, user, isPublicPage, router]);

  if (isPublicPage) {
    return <main className="min-h-screen bg-[#f1f5f2]">{children}</main>;
  }

  if (isLoading) {
    return <main className="min-h-screen bg-[#f1f5f2]" />;
  }

  if (!user) {
    return <main className="min-h-screen bg-[#f1f5f2]" />;
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

