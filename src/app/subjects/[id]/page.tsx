'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  FileText,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ListOrdered,
  Calendar,
  Layers,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, Topic, EducationalResource, Assessment, Grade } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { formatBytes } from '@/lib/utils';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.id as string;
  const { user } = useAuth();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (subjectId) {
      const sub = AppStore.getSubjectById(subjectId);
      if (sub) {
        setSubject(sub);
        setTopics(AppStore.getTopics(sub.id));
        setResources(AppStore.getResourcesBySubject(sub.id));
        setAssessments(AppStore.getAssessments(sub.id));
      }
      setGrades(AppStore.getGrades());
    }
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-base font-bold text-slate-800">Subject Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested curriculum subject could not be found.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const grade = grades.find((g) => g.id === subject.grade_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learner Dashboard</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              {subject.code}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {grade?.name} ({grade?.phase})
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{subject.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{subject.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/reader?subject=${subject.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Open Subject Textbooks</span>
          </Link>

          <Link
            href={`/ai-tutor?subject=${subject.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Ask Subject AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Syllabus Topics + Resources & Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: CAPS Syllabus Topics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-blue-600" />
              <span>CAPS Curriculum Topics & Syllabus</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Term 1 & 2 Focus</span>
          </div>

          {topics.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No topics published for this subject yet.
            </div>
          ) : (
            <div className="space-y-3">
              {topics.map((t, idx) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{t.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t.estimated_hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Subject Resources & Assessments */}
        <div className="space-y-6">
          {/* Approved Resources */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Subject Learning Materials</span>
            </h3>

            {resources.length === 0 ? (
              <p className="text-xs text-slate-400">No resources assigned to this subject yet.</p>
            ) : (
              <div className="space-y-2.5">
                {resources.map((r) => (
                  <Link
                    key={r.id}
                    href={`/reader/${r.id}`}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start gap-2.5 block group"
                  >
                    <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700">
                        {r.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {r.pages_count} Pages • {formatBytes(r.file_size_bytes)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Practice Assessments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Subject Assessments</span>
            </h3>

            {assessments.length === 0 ? (
              <p className="text-xs text-slate-400">No assessments scheduled yet.</p>
            ) : (
              <div className="space-y-2.5">
                {assessments.map((a) => (
                  <Link
                    key={a.id}
                    href={`/assessments/${a.id}`}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-start justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                        {a.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {a.total_marks} Marks • {a.time_limit_minutes} Mins
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

