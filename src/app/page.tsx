'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  School as SchoolIcon,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function HomePage() {
  const { user, role, switchRole } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold border border-blue-200 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>National Secondary Education LMS • Grades 8–12</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Digitising Secondary Education for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
              Grades 8 to 12
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, fully functional learning platform built for South African secondary
            schools. Featuring official CAPS curricula, interactive document reading, highlight-to-AI study assistance, and authentic academic progress tracking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md hover:scale-105"
            >
              <span>Start Learner Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 transition-colors shadow-2xs"
            >
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Go to Learner Dashboard</span>
            </Link>

            <Link
              href="/reader"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm border border-purple-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Document Reader & AI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Architectural Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Comprehensive Digital Secondary Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Every feature connects to real database logic, real student profiles, and verified South African CAPS educational standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Onboarding & Subject Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Learner Onboarding & Subjects
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Step-by-step registration selecting verified schools, Grade 8–12 level, and dynamic subject offerings aligned with Senior & FET Phases.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Test Onboarding Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 2: Document Reader & Highlighting */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Integrated Document Reader
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Page navigation, zooming, live text selection, persistent colour highlighting, and instant contextual &quot;Ask AI&quot; trigger.
              </p>
            </div>
            <Link
              href="/reader"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              <span>Launch Reader</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 3: Grounded AI Study Assistant */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                AI Learning Assistant (RAG)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Grounded in approved curriculum materials with configurable local Ollama inference, breaking down complex science and math into bite-sized steps.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              <span>Open AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 4: Digital Educational Library */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Digital Resource Repository
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Centralized library of textbooks, study guides, worksheets, past examination papers, and teacher-published revision notes.
              </p>
            </div>
            <Link
              href="/library"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>Explore Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 5: Formative & Summative Testing */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Assessments & Instant Grading
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete curriculum quizzes and tests with automated scoring, point allocation, and detailed answer explanations.
              </p>
            </div>
            <Link
              href="/assessments"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-800"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 6: Multi-Role Access Control */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Role-Based Portals (RBAC)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated interfaces for Learners, Teachers, School Administrators, and National Platform Administrators with Row Level Security.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => switchRole('learner')}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 font-semibold"
              >
                Learner
              </button>
              <button
                type="button"
                onClick={() => switchRole('teacher')}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-semibold"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => switchRole('school_admin')}
                className="px-2 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200 font-semibold"
              >
                School Admin
              </button>
              <button
                type="button"
                onClick={() => switchRole('platform_admin')}
                className="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200 font-semibold"
              >
                Platform Admin
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

