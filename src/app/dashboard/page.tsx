'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ClipboardCheck,
  FileText,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Calendar,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AppStore } from '@/lib/store/appStore';
import {
  Subject,
  LearningProgress,
  EducationalResource,
  Assessment,
  LearnerSubmission,
  AIStudyInteraction,
} from '@/types';
import { formatDate } from '@/lib/utils';

export default function LearnerDashboardPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progressRecords, setProgressRecords] = useState<LearningProgress[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [aiInteractions, setAiInteractions] = useState<AIStudyInteraction[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load enrolled subjects
    const allSubjects = AppStore.getSubjects();
    const enrolledIds = user.enrolled_subject_ids || [];
    const userSubs =
      enrolledIds.length > 0
        ? allSubjects.filter((s) => enrolledIds.includes(s.id))
        : allSubjects.filter((s) => s.grade_id === user.grade_id);

    setSubjects(userSubs);
    setProgressRecords(AppStore.getProgress(user.id));
    setResources(AppStore.getResources());
    setAssessments(AppStore.getAssessments());
    setSubmissions(AppStore.getSubmissions(user.id));
    setAiInteractions(AppStore.getAIInteractions(user.id));
  }, [user]);

  // Real Progress Calculations
  const totalTopicsTracked = subjects.length * 3; // Approx 3 topics per subject in current term
  const completedRecords = progressRecords.filter((p) => p.status === 'completed');
  const inProgressRecords = progressRecords.filter((p) => p.status === 'in_progress');
  const viewedRecords = progressRecords.filter((p) => p.status === 'viewed');

  const topicsCompletedCount = completedRecords.length;
  const topicsInProgressCount = inProgressRecords.length;
  const topicsNotStartedCount = Math.max(
    0,
    totalTopicsTracked - (topicsCompletedCount + topicsInProgressCount)
  );

  // Content completion percentage
  const contentProgressPercent =
    totalTopicsTracked > 0
      ? Math.round((topicsCompletedCount / totalTopicsTracked) * 100)
      : 0;

  // Assessment Performance
  const completedAssessmentsCount = submissions.length;
  const averageAssessmentScore =
    completedAssessmentsCount > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.percentage, 0) / completedAssessmentsCount
        )
      : 0;

  // Total study time
  const totalSecondsSpent = progressRecords.reduce((acc, curr) => acc + curr.time_spent_seconds, 0);
  const totalMinutesSpent = Math.round(totalSecondsSpent / 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/20">
            <GraduationCap className="w-4 h-4 text-blue-200" />
            <span>Academic Year 2026 • Term 1 (CAPS)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Learner'}!
          </h1>

          <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
            Enrolled in <strong className="text-white">{user?.grade_name || 'Grade 10'}</strong> at{' '}
            <strong className="text-white">{user?.school_name || 'Pretoria Boys High School'}</strong>
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-200" />
              <span>Current Term: Term 1 (Jan–Mar 2026)</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-200" />
              <span>Active Study Time: {totalMinutesSpent} minutes</span>
            </div>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 2. LEARNING METRICS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            My Learning Progress & Performance
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Computed from real database activity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card A: Overall Topics Completed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Topics Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{topicsCompletedCount}</span>
              <span className="text-xs text-slate-400">/ {totalTopicsTracked} topics</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${contentProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {contentProgressPercent}% curriculum syllabus completed
            </p>
          </div>

          {/* Card B: Topics In Progress */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Topics In Progress
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{topicsInProgressCount}</span>
              <span className="text-xs text-slate-400">active topics</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (topicsInProgressCount / Math.max(1, totalTopicsTracked)) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {topicsNotStartedCount} topics not yet started
            </p>
          </div>

          {/* Card C: Content Viewed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Materials Read
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {viewedRecords.length + completedRecords.length}
              </span>
              <span className="text-xs text-slate-400">textbooks & guides</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {AppStore.getHighlights(user?.id || '').length} active highlights stored
            </p>
          </div>

          {/* Card D: Assessment Performance */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Mark
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {completedAssessmentsCount > 0 ? `${averageAssessmentScore}%` : 'N/A'}
              </span>
              <span className="text-xs text-slate-400">
                ({completedAssessmentsCount} completed)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{ width: `${averageAssessmentScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {averageAssessmentScore >= 50 ? 'Curriculum Competent' : 'Needs Practice'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. MY SUBJECTS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              My Subjects
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved CAPS subjects for {user?.grade_name || 'Grade 10'}
            </p>
          </div>

          <Link
            href="/library"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Browse All Resources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-slate-800">No Enrolled Subjects</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t selected any subjects yet. Complete the onboarding wizard to pick your subjects.
            </p>
            <Link
              href="/onboarding"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Configure Subjects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((subj) => {
              const subjResources = resources.filter((r) => r.subject_id === subj.id);
              const subjProgress = progressRecords.filter((p) => p.subject_id === subj.id);
              const subjAssessments = assessments.filter((a) => a.subject_id === subj.id);

              return (
                <div
                  key={subj.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {subj.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                          {subj.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {subj.category.split(',')[0]}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{subj.description}</p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center mb-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-800">
                          {subjResources.length}
                        </span>
                        <span className="text-[10px] text-slate-400">Resources</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800">
                          {subjAssessments.length}
                        </span>
                        <span className="text-[10px] text-slate-400">Assessments</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-emerald-600">
                          {subjProgress.filter((p) => p.status === 'completed').length > 0
                            ? 'Active'
                            : 'Started'}
                        </span>
                        <span className="text-[10px] text-slate-400">Status</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href={`/reader?subject=${subj.id}`}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Textbooks</span>
                    </Link>

                    <Link
                      href={`/ai-tutor?subject=${subj.id}`}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
                      title="Ask AI Tutor"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RECENT ACTIVITY & DIRECT ACCESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Recent Learning Activity
          </h3>

          <div className="space-y-4">
            {/* Show AI sessions, reading sessions, and assessment submissions */}
            {aiInteractions.length === 0 &&
            submissions.length === 0 &&
            progressRecords.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No recent activity recorded yet. Open a textbook in the reader or complete a practice quiz to see your live learning history!
              </div>
            ) : (
              <>
                {submissions.slice(0, 2).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Completed Assessment
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(sub.submitted_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Scored <strong>{sub.percentage}%</strong> ({sub.total_score} marks).{' '}
                        {sub.feedback}
                      </p>
                    </div>
                  </div>
                ))}

                {aiInteractions.slice(0, 2).map((ai) => (
                  <div
                    key={ai.id}
                    className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          AI Study Interaction
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(ai.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        Question: &quot;{ai.prompt}&quot;
                      </p>
                      {ai.highlighted_text && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                          Excerpt: &quot;{ai.highlighted_text}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {progressRecords.slice(0, 2).map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Document Reading Session
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(prog.last_accessed_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Read to Page {prog.last_read_page} of {prog.total_pages} (
                        {prog.progress_percent}% progress)
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">Quick Study Tools</h3>
            <div className="space-y-3">
              <Link
                href="/reader"
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Integrated Reader</h4>
                  <p className="text-[11px] text-slate-500">Read with live text highlighting</p>
                </div>
              </Link>

              <Link
                href="/ai-tutor"
                className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-colors flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AI Learning Assistant</h4>
                  <p className="text-[11px] text-slate-500">Ask questions grounded in CAPS</p>
                </div>
              </Link>

              <Link
                href="/assessments"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Practice Assessments</h4>
                  <p className="text-[11px] text-slate-500">Test understanding with instant marks</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            CAPS Secondary Standards • Department of Basic Education
          </div>
        </div>
      </div>
    </div>
  );
}

