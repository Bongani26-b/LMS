'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Assessment, LearnerSubmission, Subject } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { formatDate } from '@/lib/utils';

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setAssessments(AppStore.getAssessments());
    setSubjects(AppStore.getSubjects());
    if (user) {
      setSubmissions(AppStore.getSubmissions(user.id));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-2">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Formative & Summative Testing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Assessments & Exercises
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete CAPS curriculum assessments to test your understanding, identify learning gaps, and track academic marks.
        </p>
      </div>

      {/* Assessment Cards */}
      {assessments.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Assessments Available</h3>
          <p className="text-xs text-slate-500 mt-1">
            Your subject teachers have not published any assessments for this term yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((asmt) => {
            const subject = subjects.find((s) => s.id === asmt.subject_id);
            const submission = submissions.find((s) => s.assessment_id === asmt.id);
            const isCompleted = !!submission;

            return (
              <div
                key={asmt.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {asmt.assessment_type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {asmt.total_marks} Marks
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug mb-2">
                    {asmt.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {asmt.description}
                  </p>

                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-[11px] text-slate-500 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subject:</span>
                      <span className="font-semibold text-slate-800">
                        {subject?.name || 'CAPS'} ({subject?.code || ''})
                      </span>
                    </div>
                    {asmt.time_limit_minutes && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time Limit:</span>
                        <span className="text-slate-800">{asmt.time_limit_minutes} minutes</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      {isCompleted ? (
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Scored {submission.percentage}%</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-blue-600">Ready to attempt</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/assessments/${asmt.id}`}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span>{isCompleted ? 'Review Answers & Marks' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

