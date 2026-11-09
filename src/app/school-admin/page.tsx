'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  School as SchoolIcon,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { School, Subject, Grade } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function SchoolAdminPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  useEffect(() => {
    setSchools(AppStore.getSchools());
    setSubjects(AppStore.getSubjects());
    setGrades(AppStore.getGrades());
  }, []);

  const currentSchool = schools.find((s) => s.id === user?.school_id) || schools[0];

  const filteredSubjects = subjects.filter((s) => {
    if (selectedGradeFilter !== 'all' && s.grade_id !== selectedGradeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold mb-2">
            <SchoolIcon className="w-3.5 h-3.5" />
            <span>School Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentSchool?.name || 'Pretoria Boys High School'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            EMS Code: <span className="font-mono font-semibold">{currentSchool?.ems_code || 'ZA-GP-00124'}</span> • {currentSchool?.province} Department of Education
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DBE Registered & Active</span>
          </span>
        </div>
      </div>

      {/* School KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Registered Learners
          </span>
          <span className="text-2xl font-black text-slate-900">420</span>
          <p className="text-[11px] text-slate-400 mt-1">Grades 8 through 12</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Teaching Staff</span>
          <span className="text-2xl font-black text-blue-600">32</span>
          <p className="text-[11px] text-slate-400 mt-1">Educators assigned to CAPS subjects</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Active Subjects</span>
          <span className="text-2xl font-black text-purple-600">{subjects.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Curriculum offerings enabled</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Academic Schedule
          </span>
          <span className="text-lg font-bold text-slate-900">Term 1 (2026)</span>
          <p className="text-[11px] text-slate-400 mt-1">14 Jan – 27 Mar 2026</p>
        </div>
      </div>

      {/* Subject Offerings Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              School Subject Offerings & Allocation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control which national CAPS subjects your secondary school offers per grade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Grade:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Grades (8–12)</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((sub) => {
            const grade = grades.find((g) => g.id === sub.grade_id);
            return (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200 flex items-start justify-between bg-slate-50/50"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {sub.code} • {grade?.name}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">{sub.name}</h4>
                  <span className="inline-block mt-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {sub.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Offered</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

