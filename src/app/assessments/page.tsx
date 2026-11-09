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
  Sparkles,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Assessment, LearnerSubmission, Subject } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8f5ec] text-[#1b382b] rounded-full text-xs font-semibold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#246043]" />
            <span>Formative & Summative Testing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quiz & Assessments
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Test your understanding across CAPS modules. Your marks are automatically logged to your student analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/library">
            <Button variant="outline" className="rounded-full border-slate-200 text-xs h-10 px-5 gap-2">
              <BookOpen className="w-4 h-4 text-[#1b382b]" />
              Review Textbooks
            </Button>
          </Link>
        </div>
      </div>

      {/* Assessment Cards */}
      {assessments.length === 0 ? (
        <Card className="py-16 text-center border-slate-100 shadow-xs">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Assessments Available</h3>
          <p className="text-xs text-slate-500 mt-1">
            Assessments will appear here once published for your registered subjects.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((asmt) => {
            const subject = subjects.find((s) => s.id === asmt.subject_id);
            const submission = submissions.find((s) => s.assessment_id === asmt.id);
            const isCompleted = !!submission;

            return (
              <Card
                key={asmt.id}
                className="hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden border-slate-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant="secondary" className="bg-[#e8f5ec] text-[#1b382b] text-[10px] font-bold uppercase tracking-wider">
                      {asmt.assessment_type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold">
                      {asmt.total_marks} Marks
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug mb-2">
                    {asmt.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-5 leading-relaxed">
                    {asmt.description}
                  </p>

                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subject:</span>
                      <span className="font-bold text-slate-800">
                        {subject?.name || 'CAPS Subject'}
                      </span>
                    </div>
                    {asmt.time_limit_minutes && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time Limit:</span>
                        <span className="text-slate-700 font-medium">{asmt.time_limit_minutes} mins</span>
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
                        <span className="font-semibold text-amber-600">Ready to attempt</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link href={`/assessments/${asmt.id}`} className="block">
                    <Button
                      className={`w-full rounded-2xl text-xs font-bold h-11 gap-2 shadow-xs ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                          : 'bg-[#1b382b] hover:bg-[#142a20] text-white'
                      }`}
                    >
                      <span>{isCompleted ? 'Review Submission' : 'Start Assessment'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
