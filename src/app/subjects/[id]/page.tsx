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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SubjectDetailPage() {
  const params = useParams();
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
      <Card className="max-w-md mx-auto my-20 p-8 text-center border-slate-100 shadow-xs">
        <h2 className="text-base font-bold text-slate-800">Subject Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested curriculum subject could not be found.</p>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button className="rounded-full bg-[#1b382b] hover:bg-[#142a20] text-xs h-9 px-5 gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </Card>
    );
  }

  const grade = grades.find((g) => g.id === subject.grade_id);

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#1b382b] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learner Dashboard</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-[#e8f5ec] text-[#1b382b] font-bold text-[10px] uppercase">
              {subject.code}
            </Badge>
            <span className="text-xs font-semibold text-slate-500">
              {grade?.name} ({grade?.phase})
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{subject.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{subject.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/reader?subject=${subject.id}`}>
            <Button className="rounded-full bg-[#1b382b] hover:bg-[#142a20] text-white text-xs font-bold h-10 px-5 gap-2 shadow-xs">
              <FileText className="w-4 h-4" />
              <span>Read Textbooks</span>
            </Button>
          </Link>

          <Link href={`/ai-tutor?subject=${subject.id}`}>
            <Button variant="outline" className="rounded-full border-[#1b382b] text-[#1b382b] hover:bg-[#e8f5ec] text-xs font-bold h-10 px-5 gap-2">
              <Sparkles className="w-4 h-4 text-[#246043]" />
              <span>Ask AI Tutor</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Syllabus Topics + Resources & Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: CAPS Syllabus Topics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#246043]" />
              <span>CAPS Curriculum Topics & Syllabus</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Term 1 & 2 Focus</span>
          </div>

          {topics.length === 0 ? (
            <Card className="p-8 text-center border-slate-100 text-slate-400 text-xs">
              No topics published for this subject yet.
            </Card>
          ) : (
            <div className="space-y-3">
              {topics.map((t, idx) => (
                <Card
                  key={t.id}
                  className="p-5 border-slate-100 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#e8f5ec] text-[#1b382b] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{t.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t.estimated_hours}h
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Subject Resources & Assessments */}
        <div className="space-y-6">
          {/* Approved Resources */}
          <Card className="p-6 border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#246043]" />
              <span>Subject Textbooks</span>
            </h3>

            {resources.length === 0 ? (
              <p className="text-xs text-slate-400">No resources assigned to this subject yet.</p>
            ) : (
              <div className="space-y-2.5">
                {resources.map((r) => (
                  <Link
                    key={r.id}
                    href={`/reader/${r.id}`}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-[#f8faf9] hover:border-[#1b382b] hover:bg-white transition-all flex items-start gap-2.5 block group shadow-2xs"
                  >
                    <FileText className="w-4 h-4 text-[#246043] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#1b382b]">
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
          </Card>

          {/* Practice Assessments */}
          <Card className="p-6 border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#246043]" />
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
                    className="p-3.5 rounded-2xl border border-slate-100 bg-[#f8faf9] hover:border-[#1b382b] hover:bg-white transition-all flex items-start justify-between group shadow-2xs"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1b382b]">
                        {a.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {a.total_marks} Marks • {a.time_limit_minutes} Mins
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1b382b]" />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
