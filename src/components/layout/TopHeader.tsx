'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, BookOpen, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'next/navigation';

export function TopHeader() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleText = user?.full_name
    ? `@${user.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : '@learner';

  return (
    <header className="h-20 bg-transparent px-6 sm:px-8 flex items-center justify-between gap-4">
      {/* Search Input Pill matching reference screenshot */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find your Course, subject, textbook or topic..."
            className="w-full bg-white pl-11 pr-5 py-2.5 rounded-full border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] shadow-2xs transition-all"
          />
        </div>
      </form>

      {/* Right User Bar */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* User Chip Profile matching reference screenshot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#1b382b] text-white flex items-center justify-center font-bold text-xs">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {user?.full_name || 'Learner'}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {handleText}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in"
              onMouseLeave={() => setProfileOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 block">{user?.full_name}</span>
                <span className="text-[11px] text-slate-400 block">{user?.email}</span>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                  {user?.grade_name || 'Grade 10'} • {role.toUpperCase()}
                </span>
              </div>

              <Link
                href="/profile"
                className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                onClick={() => setProfileOpen(false)}
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile & Settings</span>
              </Link>

              <Link
                href="/onboarding"
                className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 border-t border-slate-100"
                onClick={() => setProfileOpen(false)}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>New Registration / Onboarding</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

