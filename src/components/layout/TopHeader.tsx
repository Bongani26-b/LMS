'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, BookOpen, User, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'next/navigation';

export function TopHeader() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchSuggestions = ['Mathematics Grade 10', 'Physical Sciences', 'Life Sciences', 'English Home Language', 'Accounting'];
  const filteredSuggestions = searchSuggestions.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleText = user?.full_name
    ? `@${user.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : '@learner';

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push('/login');
  };

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
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Find your Course, subject, textbook or topic..."
            className="w-full bg-white pl-11 pr-5 py-2.5 rounded-full border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] shadow-2xs transition-all"
          />

          {searchFocused && searchQuery && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
              {filteredSuggestions.map((suggestion) => (
                <button key={suggestion} type="button" onMouseDown={() => { setSearchQuery(suggestion); router.push(`/library?q=${encodeURIComponent(suggestion)}`); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"><Search className="h-3.5 w-3.5 text-slate-400" />{suggestion}</button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Right User Bar */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
              {['New Mathematics assignment uploaded', 'Life Sciences quiz closes tomorrow', 'Dr. Evelyn Smith replied to your message'].map((alert, index) => (
                <button key={alert} type="button" onClick={() => setNotificationsOpen(false)} className="flex w-full gap-3 px-4 py-3 text-left text-xs text-slate-700 hover:bg-slate-50"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" /><span><b className="block">{index === 0 ? 'New resource' : index === 1 ? 'Assessment reminder' : 'Message received'}</b><span className="mt-0.5 block text-slate-500">{alert}</span></span></button>
              ))}
            </div>
          )}
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

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-slate-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

