'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  ClipboardCheck,
  LayoutDashboard,
  Shield,
  School as SchoolIcon,
  Users,
  UploadCloud,
  ChevronDown,
  UserCheck,
  Settings,
  Sparkle,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '@/types';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, switchRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getNavLinks = () => {
    switch (role) {
      case 'learner':
        return [
          { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { href: '/library', label: 'Digital Library', icon: BookOpen },
          { href: '/reader', label: 'Document Reader', icon: FileText },
          { href: '/assessments', label: 'Assessments', icon: ClipboardCheck },
          { href: '/ai-tutor', label: 'AI Study Tutor', icon: Sparkles },
        ];
      case 'teacher':
        return [
          { href: '/teacher', label: 'Teacher Studio', icon: LayoutDashboard },
          { href: '/teacher/upload', label: 'Upload Materials', icon: UploadCloud },
          { href: '/teacher/assessments/new', label: 'Create Assessment', icon: ClipboardCheck },
          { href: '/teacher/submissions', label: 'Markbook & Submissions', icon: ClipboardCheck },
          { href: '/library', label: 'Library Resources', icon: BookOpen },
        ];
      case 'school_admin':
        return [
          { href: '/school-admin', label: 'School Admin', icon: SchoolIcon },
          { href: '/school-admin/offerings', label: 'Curriculum Offerings', icon: BookOpen },
          { href: '/school-admin/users', label: 'Staff & Learners', icon: Users },
          { href: '/library', label: 'School Library', icon: FileText },
        ];
      case 'platform_admin':
        return [
          { href: '/platform-admin', label: 'Platform Console', icon: Shield },
          { href: '/platform-admin/curricula', label: 'Curricula (CAPS)', icon: BookOpen },
          { href: '/platform-admin/schools', label: 'Schools', icon: SchoolIcon },
          { href: '/platform-admin/ai-settings', label: 'AI & Inference Config', icon: Settings },
        ];
    }
  };

  const links = getNavLinks();

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    learner: { label: 'Learner', badge: 'Grade 10', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    teacher: { label: 'Teacher', badge: 'Sciences Lead', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    school_admin: { label: 'School Admin', badge: 'Principal', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    platform_admin: { label: 'Platform Admin', badge: 'DBE National', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight block leading-tight">
                  Digital Secondary
                </span>
                <span className="text-[11px] font-semibold text-blue-600 tracking-wide uppercase">
                  CAPS Grades 8–12 LMS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links for Active Role */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Role Switcher & Onboarding Trigger */}
          <div className="flex items-center gap-3">
            {/* Onboarding Wizard Link */}
            <Link
              href="/onboarding"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Learner Onboarding</span>
            </Link>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  roleLabels[role].color
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span className="font-semibold">{roleLabels[role].label}</span>
                <span className="opacity-75">({roleLabels[role].badge})</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Persona
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Test multi-role access control & functionality
                    </p>
                  </div>

                  {(['learner', 'teacher', 'school_admin', 'platform_admin'] as UserRole[]).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          switchRole(r);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          role === r ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="capitalize font-medium">{roleLabels[r].label}</div>
                          <div className="text-[10px] text-slate-400">{roleLabels[r].badge}</div>
                        </div>
                        {role === r && (
                          <span className="text-xs text-blue-600 font-bold">✓ Active</span>
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar & School Info */}
            <Link href="/profile" className="flex items-center gap-2 pl-2 border-l border-slate-200 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {user?.full_name || 'Logged In User'}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {user?.school_name || 'Pretoria Boys High'}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

