'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Layers,
  Award,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, Grade, Curriculum } from '@/types';
import { INITIAL_CURRICULUM } from '@/lib/data/curriculumData';

export default function CurriculaConsolePage() {
  const [curriculum, setCurriculum] = useState<Curriculum>(INITIAL_CURRICULUM);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'senior' | 'fet'>('senior');

  useEffect(() => {
    setGrades(AppStore.getGrades());
    setSubjects(AppStore.getSubjects());
  }, []);

  const seniorSubjects = subjects.filter(
    (s) => s.grade_id === 'grade-8' || s.grade_id === 'grade-9'
  );
  const fetSubjects = subjects.filter(
    (s) => s.grade_id === 'grade-10' || s.grade_id === 'grade-11' || s.grade_id === 'grade-12'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/platform-admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Platform Governance</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>National Curriculum Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curricula & Standards Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Basic Education National Curriculum and Assessment Policy Statement (CAPS) version governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Active Version: {curriculum.version}
          </span>
        </div>
      </div>

      {/* Curriculum Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {curriculum.code}
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{curriculum.name}</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">{curriculum.description}</p>
        </div>

        <div className="sm:border-l sm:border-slate-100 sm:pl-6 text-xs text-slate-500 space-y-1">
          <div>
            Jurisdiction: <span className="font-semibold text-slate-900">{curriculum.country}</span>
          </div>
          <div>
            Target Grades:{' '}
            <span className="font-semibold text-slate-900">Grades 8 to 12 (Secondary)</span>
          </div>
          <div>
            Status:{' '}
            <span className="font-semibold text-emerald-600">Nationally Promulgated</span>
          </div>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('senior')}
          className={`py-3 px-6 transition-colors border-b-2 ${
            activeTab === 'senior'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Senior Phase (Grades 8–9)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fet')}
          className={`py-3 px-6 transition-colors border-b-2 ${
            activeTab === 'fet'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          FET Phase (Grades 10–12 Matric)
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(activeTab === 'senior' ? seniorSubjects : fetSubjects).map((sub) => {
          const g = grades.find((gr) => gr.id === sub.grade_id);
          return (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {sub.code} • {g?.name}
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  {sub.category}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{sub.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

