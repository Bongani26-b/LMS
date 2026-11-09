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
  HelpCircle,
  LogOut,
  GraduationCap,
  Shield,
  School as SchoolIcon,
  UploadCloud,
  ChevronDown,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '@/types';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, role, switchRole, logout } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const getNavItems = () => {
    switch (role) {
      case 'learner':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/library', label: 'Digital Library', icon: BookOpen },
          { href: '/reader', label: 'Document Reader', icon: FileText },
          { href: '/assessments', label: 'Quiz & Assessments', icon: ClipboardCheck },
          { href: '/ai-tutor', label: 'AI Study Tutor', icon: Sparkles },
          { href: '/profile', label: 'My Academic Profile', icon: User },
        ];
      case 'teacher':
        return [
          { href: '/teacher', label: 'Teacher Studio', icon: LayoutDashboard },
          { href: '/teacher/upload', label: 'Upload Materials', icon: UploadCloud },
          { href: '/teacher/assessments/new', label: 'Create Assessment', icon: ClipboardCheck },
          { href: '/teacher/submissions', label: 'Markbook', icon: Award },
          { href: '/library', label: 'Library Resources', icon: BookOpen },
        ];
      case 'school_admin':
        return [
          { href: '/school-admin', label: 'School Admin', icon: SchoolIcon },
          { href: '/school-admin/offerings', label: 'Curriculum Offerings', icon: BookOpen },
          { href: '/school-admin/users', label: 'Staff & Learners', icon: User },
          { href: '/library', label: 'School Library', icon: FileText },
        ];
      case 'platform_admin':
        return [
          { href: '/platform-admin', label: 'Platform Console', icon: Shield },
          { href: '/platform-admin/curricula', label: 'Curricula (CAPS)', icon: BookOpen },
          { href: '/platform-admin/schools', label: 'Schools Registry', icon: SchoolIcon },
          { href: '/platform-admin/ai-settings', label: 'AI & Inference', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    learner: { label: 'Learner', badge: user?.grade_name || 'Grade 10' },
    teacher: { label: 'Teacher', badge: 'Educator' },
    school_admin: { label: 'School Admin', badge: 'Principal' },
    platform_admin: { label: 'Platform Admin', badge: 'DBE National' },
  };

  return (
    <aside className="w-64 bg-[#1b382b] text-emerald-50 flex flex-col justify-between shrink-0 min-h-screen select-none border-r border-[#152e23] relative overflow-hidden">
      {/* Top Brand Logo */}
      <div className="p-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5 leading-tight">
              <span>QraStudy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-emerald-300/70 font-medium">CAPS Grades 8–12 LMS</p>
          </div>
        </Link>

        {/* Role Switcher Pill */}
        <div className="mt-5 relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full px-3 py-2 rounded-xl bg-[#234536] hover:bg-[#2a5241] border border-emerald-700/40 text-xs flex items-center justify-between text-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">{roleLabels[role].label}</span>
              <span className="text-[10px] text-emerald-300/70">({roleLabels[role].badge})</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {roleDropdownOpen && (
            <div
              className="absolute left-0 right-0 mt-1.5 bg-[#173024] border border-emerald-700/50 rounded-xl shadow-2xl py-1.5 z-50 text-xs"
              onMouseLeave={() => setRoleDropdownOpen(false)}
            >
              {(['learner', 'teacher', 'school_admin', 'platform_admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    switchRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#234536] transition-colors ${
                    role === r ? 'font-bold text-emerald-300 bg-[#204031]' : 'text-emerald-100'
                  }`}
                >
                  <span className="capitalize">{roleLabels[r].label}</span>
                  {role === r && <span className="text-[10px] text-emerald-400">Active</span>}
                </button>
              ))}
            </div>
          )}
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2b5441] text-[#facc15] shadow-sm font-bold border-l-4 border-[#facc15]'
                      : 'text-emerald-100/80 hover:text-white hover:bg-[#224435]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#facc15]' : 'text-emerald-300/80'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider block mb-2">
            Help & Tools
          </span>
          <div className="space-y-1">
            <Link
              href="/onboarding"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-emerald-200/80 hover:text-white hover:bg-[#224435] transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Learner Registration</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-emerald-200/80 hover:text-white hover:bg-[#224435] transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Mascot Watermark & Logout */}
      <div className="p-4 border-t border-emerald-800/40 relative">
        <div className="flex items-center justify-between text-xs text-emerald-300/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-[11px] text-emerald-200 border border-emerald-400/30">
              {user?.full_name?.charAt(0) || 'L'}
            </div>
            <div className="truncate max-w-[110px]">
              <span className="font-semibold text-white block truncate text-[11px]">
                {user?.full_name || 'Learner'}
              </span>
              <span className="text-[10px] text-emerald-400/70 truncate block">
                {user?.school_name || 'Secondary'}
              </span>
            </div>
          </div>

          <Link
            href="/onboarding"
            title="Log Out / Register New"
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-[#264c3c] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Subtle decorative watermark icon matching screenshot */}
        <div className="absolute right-2 bottom-1 opacity-10 pointer-events-none text-emerald-200">
          <GraduationCap className="w-16 h-16" />
        </div>
      </div>
    </aside>
  );
}

