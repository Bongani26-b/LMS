'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  UploadCloud,
  ClipboardCheck,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, EducationalResource, LearnerSubmission, Assessment } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { formatDate } from '@/lib/utils';

export default function TeacherStudioPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    // In our teacher persona, Dr. Evelyn Smith teaches Grade 10 Physical Sciences & Grade 12 Life Sciences
    const allSubs = AppStore.getSubjects();
    const teacherSubs = allSubs.filter(
      (s) => s.id === 'subj-phsc-10' || s.id === 'subj-lfsc-12' || s.id === 'subj-math-10'
    );
    setSubjects(teacherSubs);
    setResources(AppStore.getResources());
    setSubmissions(AppStore.getSubmissions());
    setAssessments(AppStore.getAssessments());
  }, []);

  const totalLearnersAssigned = 64; // In Dr. Smith's class rosters
  const averageSubjectScore =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.percentage, 0) / submissions.length
        )
      : 82;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher Management Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Educator Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your assigned CAPS classes, upload textbooks & study guides, and review student assessment submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/teacher/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Materials</span>
          </Link>
          <Link
            href="/teacher/submissions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Markbook</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Enrolled Learners
          </span>
          <span className="text-2xl font-black text-slate-900">{totalLearnersAssigned}</span>
          <p className="text-[11px] text-slate-400 mt-1">Across 3 active class rosters</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Published Resources
          </span>
          <span className="text-2xl font-black text-blue-600">{resources.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Textbooks, guides & worksheets</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Submissions Received
          </span>
          <span className="text-2xl font-black text-purple-600">{submissions.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Automatically scored & tracked</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Class Average Mark
          </span>
          <span className="text-2xl font-black text-emerald-600">{averageSubjectScore}%</span>
          <p className="text-[11px] text-slate-400 mt-1">Meeting CAPS achievement targets</p>
        </div>
      </div>

      {/* Assigned Subjects & Classes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          My Assigned Subjects & Classes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const subResCount = resources.filter((r) => r.subject_id === sub.id).length;
            const subAsmtCount = assessments.filter((a) => a.subject_id === sub.id).length;

            return (
              <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {sub.code}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">{sub.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{sub.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-600">
                  <span>{subResCount} Library Resources</span>
                  <span>{subAsmtCount} Assessments</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions to Review */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
            Recent Assessment Submissions
          </h2>
          <Link
            href="/teacher/submissions"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Full Markbook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No submissions recorded yet. Once learners take quizzes or assignments, their responses appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Learner ID</th>
                  <th className="py-3 px-4 font-semibold">Assessment</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{sub.learner_id}</td>
                    <td className="py-3 px-4 text-slate-600">{sub.assessment_id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{sub.percentage}%</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(sub.submitted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

