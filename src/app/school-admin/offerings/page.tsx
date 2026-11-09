'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Filter,
  Check,
  School as SchoolIcon,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, Grade, School } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function SchoolOfferingsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [offeredSubjectIds, setOfferedSubjectIds] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const allSubs = AppStore.getSubjects();
    setSubjects(allSubs);
    setGrades(AppStore.getGrades());
    // By default, all initialized subjects are offered
    setOfferedSubjectIds(allSubs.map((s) => s.id));
  }, []);

  const handleToggle = (id: string) => {
    if (offeredSubjectIds.includes(id)) {
      setOfferedSubjectIds(offeredSubjectIds.filter((sId) => sId !== id));
    } else {
      setOfferedSubjectIds([...offeredSubjectIds, id]);
    }
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const filtered = subjects.filter((s) => {
    if (selectedGrade !== 'all' && s.grade_id !== selectedGrade) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/school-admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to School Administration</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Allocation & Offerings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            School Subject Offerings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Toggle which national CAPS subjects your secondary school offers for learner registration and class scheduling.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Offerings Saved</span>
            </>
          ) : (
            <span>Save School Offerings</span>
          )}
        </button>
      </div>

      {/* Grade Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Filter by Grade Level:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedGrade === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Grades
          </button>
          {grades.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGrade(g.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedGrade === g.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub) => {
          const isOffered = offeredSubjectIds.includes(sub.id);
          const grade = grades.find((g) => g.id === sub.grade_id);

          return (
            <div
              key={sub.id}
              onClick={() => handleToggle(sub.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isOffered
                  ? 'bg-white border-blue-200 ring-2 ring-blue-50'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {sub.code} • {grade?.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isOffered
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isOffered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isOffered ? 'Offered' : 'Disabled'}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{sub.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Category: <span className="text-slate-700 font-medium">{sub.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

