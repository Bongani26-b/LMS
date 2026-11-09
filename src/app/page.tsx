'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  User,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function HomePage() {
  const { user, role, switchRole } = useAuth();

  return (
    <div className="space-y-12 pb-16">
      {/* Clean Hero Card matching QraStudy style */}
      <section className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-2xs relative overflow-hidden text-center sm:text-left">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f5ec] text-[#246043] text-xs font-bold border border-[#d2ecd9]">
            <GraduationCap className="w-4 h-4" />
            <span>South African CAPS Secondary Education • Grades 8–12</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Empowering Secondary Learners with{' '}
            <span className="text-[#246043]">Digitised Education & AI</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
            Welcome to the centralized digital learning portal. Register to join your school, select your grade, pick your subjects, read approved textbooks with live highlighting, and learn with your AI study assistant.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 justify-center sm:justify-start">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b382b] hover:bg-[#244b3a] text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:scale-105"
            >
              <span>Learner Registration & Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-[#246043]" />
              <span>Enter Learner Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Decorative soft green geometric circle */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#e8f5ec]/70 pointer-events-none" />
      </section>

      {/* Feature Pillar Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center font-bold text-lg mb-4">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">
              1. Register & Select Subjects
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quick onboarding journey where learners enter their first and last name, select their secondary school, grade level (Grades 8–12), and enrolled CAPS subjects.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#246043] hover:underline"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center font-bold text-lg mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">
              2. Read & Highlight Text
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrated document reader for approved textbooks and study guides with page zooming, search, and instant text selection with persistent color highlighting.
            </p>
          </div>
          <Link
            href="/reader"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#246043] hover:underline"
          >
            <span>Open Document Reader</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center font-bold text-lg mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">
              3. Highlight-to-AI Assistant
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Highlight any sentence or paragraph in your textbook and select &quot;Ask AI&quot; to receive grounded, step-by-step educational explanations tailored to your grade.
            </p>
          </div>
          <Link
            href="/ai-tutor"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#246043] hover:underline"
          >
            <span>Ask AI Tutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
