'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Sparkles,
  ClipboardCheck,
  User,
  Settings,
  GraduationCap,
  PlaySquare,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { Badge } from '@/components/ui/badge';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Pure student navigation links - no teacher/mentor switcher
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/library', label: 'Textbooks & Materials', icon: BookOpen },
    { href: '/reader', label: 'Study Reader & AI', icon: FileText },
    { href: '/videos', label: 'Video Lessons', icon: PlaySquare },
    { href: '/assessments', label: 'Quiz & Assessments', icon: ClipboardCheck },
    { href: '/ai-tutor', label: 'AI Study Assistant', icon: Sparkles },
    { href: '/profile', label: 'My Academic Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#1b382b] text-emerald-50 flex flex-col justify-between shrink-0 min-h-screen select-none border-r border-[#152e23] relative overflow-hidden">
      {/* Brand Header */}
      <div className="p-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5 leading-tight">
              <span>QraStudy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-emerald-300/70 font-medium">CAPS Grades 8–12 LMS</p>
          </div>
        </Link>

        {/* Locked Student Status Badge (No Teacher or Mentor Toggle!) */}
        <div className="mt-5 px-3 py-2 rounded-2xl bg-[#234536] border border-emerald-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">
                Student Account
              </span>
              <span className="text-[10px] text-emerald-300/80 font-medium">
                {user?.grade_name || 'Grade 10'} • Active
              </span>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 overflow-y-auto space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider block mb-2">
            Main Menu
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2b5441] text-[#facc15] shadow-sm font-bold border-l-4 border-[#facc15]'
                      : 'text-emerald-100/80 hover:text-white hover:bg-[#224435]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#facc15]' : 'text-emerald-300/80'}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider block mb-2">
            Registration & Account
          </span>
          <div className="space-y-1">
            <Link
              href="/onboarding"
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs text-emerald-200/80 hover:text-white hover:bg-[#224435] transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>New Registration</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs text-emerald-200/80 hover:text-white hover:bg-[#224435] transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Profile Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Student Profile Footer & Logout */}
      <div className="p-4 border-t border-emerald-800/40 relative">
        <div className="flex items-center justify-between text-xs text-emerald-300/80">
          <Link href="/profile" className="flex items-center gap-2.5 truncate group">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-xs text-emerald-200 border border-emerald-400/30 group-hover:scale-105 transition-transform">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
            <div className="truncate max-w-[120px]">
              <span className="font-bold text-white block truncate text-xs group-hover:text-emerald-300 transition-colors">
                {user?.full_name || 'Registered Student'}
              </span>
              <span className="text-[10px] text-emerald-400/70 truncate block">
                {user?.grade_name || 'Grade 10'} Learner
              </span>
            </div>
          </Link>

          <Link
            href="/onboarding"
            title="Log Out / Re-register"
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#264c3c] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative watermark */}
        <div className="absolute right-2 bottom-1 opacity-10 pointer-events-none text-emerald-200">
          <GraduationCap className="w-16 h-16" />
        </div>
      </div>
    </aside>
  );
}
