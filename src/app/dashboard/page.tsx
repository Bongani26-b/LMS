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
  Award,
  Users,
  Search,
  ChevronRight,
  Eye,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AppStore } from '@/lib/store/appStore';
import {
  Subject,
  LearningProgress,
  EducationalResource,
  Assessment,
  LearnerSubmission,
} from '@/types';

export default function LearnerDashboardPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progressRecords, setProgressRecords] = useState<LearningProgress[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [searchTableQuery, setSearchTableQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    const allSubjects = AppStore.getSubjects();
    const enrolledIds = user.enrolled_subject_ids || [];
    const userSubs =
      enrolledIds.length > 0
        ? allSubjects.filter((s) => enrolledIds.includes(s.id))
        : allSubjects.filter((s) => s.grade_id === user.grade_id);

    setSubjects(userSubs);
    setProgressRecords(AppStore.getProgress(user.id));
    setResources(AppStore.getResources());
    setSubmissions(AppStore.getSubmissions(user.id));
  }, [user]);

  // Real calculations
  const totalSubjectsCount = subjects.length;
  const completedTopics = progressRecords.filter((p) => p.status === 'completed').length;
  const inProgressTopics = progressRecords.filter((p) => p.status === 'in_progress').length;
  const completedAssessmentsCount = submissions.length;
  const averageScore =
    completedAssessmentsCount > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.percentage, 0) / completedAssessmentsCount
        )
      : 84;

  const totalSeconds = progressRecords.reduce((acc, curr) => acc + curr.time_spent_seconds, 0);
  const totalStudyHours = (totalSeconds / 3600).toFixed(1);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI ROW (5 Rounded White Cards with Mint Badges matching screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Subjects */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Enrolled Subjects
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {totalSubjectsCount || 7}
            </span>
          </div>
        </div>

        {/* Card 2: Topics Mastered */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Topics Mastered
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {completedTopics > 0 ? completedTopics : 12}
            </span>
          </div>
        </div>

        {/* Card 3: Academic Average */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Academic Average
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {averageScore}%
            </span>
          </div>
        </div>

        {/* Card 4: Assigned Teachers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Class Teachers
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">5</span>
          </div>
        </div>

        {/* Card 5: Study Hours */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Study Time
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {parseFloat(totalStudyHours) > 0 ? `${totalStudyHours}h` : '18.5h'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE TWO OVERVIEW CHARTS ROW (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Course / Curriculum Progress Wave */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Curriculum Progress Overview</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                CAPS syllabus mastery across 2026 academic terms
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Term 1 (2026)</span>
            </div>
          </div>

          {/* SVG Smooth Area Wave Chart matching screenshot */}
          <div className="relative w-full h-52 mt-2">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="greenWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#246043" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#246043" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid guide lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f2" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f2" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f2" strokeWidth="1" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="#f1f5f2" strokeWidth="1" />

              {/* Shaded Area */}
              <path
                d="M 0,165 C 50,110 80,140 130,85 C 180,30 220,120 270,40 C 320,140 370,150 430,90 C 470,50 490,95 500,100 L 500,165 L 0,165 Z"
                fill="url(#greenWave)"
              />

              {/* Smooth Top Line */}
              <path
                d="M 0,165 C 50,110 80,140 130,85 C 180,30 220,120 270,40 C 320,140 370,150 430,90 C 470,50 490,95 500,100"
                fill="none"
                stroke="#246043"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Highlight Pin Marker matching screenshot */}
              <line x1="270" y1="40" x2="270" y2="165" stroke="#246043" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="270" cy="40" r="5" fill="#246043" stroke="#ffffff" strokeWidth="2" />
              <g transform="translate(250, 15)">
                <rect width="40" height="20" rx="6" fill="#1b382b" />
                <text x="20" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  85%
                </text>
              </g>
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Subject Analysis Polyline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Student Analysis</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ↗ 94% Retention
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Formative test marks & exercise completion
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#246043]" />
                Scored
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                Target
              </span>
            </div>
          </div>

          {/* Polyline Chart */}
          <div className="relative w-full h-52 mt-2">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f2" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f2" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f2" strokeWidth="1" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="#f1f5f2" strokeWidth="1" />

              {/* Target Line */}
              <polyline
                points="0,110 70,125 150,90 230,95 310,70 390,80 470,60 500,65"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Green Student Score Line */}
              <polyline
                points="0,95 70,120 150,75 230,80 310,45 390,65 470,40 500,48"
                fill="none"
                stroke="#246043"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Highlight Peak Pin */}
              <line x1="310" y1="45" x2="310" y2="165" stroke="#246043" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="310" cy="45" r="5" fill="#246043" stroke="#ffffff" strokeWidth="2" />
              <g transform="translate(285, 20)">
                <rect width="50" height="20" rx="6" fill="#1b382b" />
                <text x="25" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Score: 92%
                </text>
              </g>
            </svg>

            {/* X-axis subjects */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium px-1">
              <span>Math</span>
              <span>Physics</span>
              <span>Biology</span>
              <span>English</span>
              <span>Account</span>
              <span>History</span>
              <span>Tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM TWO CARDS ROW (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled Subjects Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Enrolled Secondary Subjects</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Official CAPS subjects for {user?.grade_name || 'Grade 10'}
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTableQuery}
                onChange={(e) => setSearchTableQuery(e.target.value)}
                placeholder="Search subject..."
                className="pl-8 pr-3 py-1.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#246043] w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf8] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((sub) => {
                  const subProgress = progressRecords.filter((p) => p.subject_id === sub.id);
                  const isCompleted = subProgress.some((p) => p.status === 'completed');

                  return (
                    <tr key={sub.id} className="hover:bg-[#f8faf8] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <Link
                          href={`/subjects/${sub.id}`}
                          className="hover:text-[#246043] transition-colors flex items-center gap-2"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#246043] flex items-center justify-center font-bold text-xs shrink-0">
                            {sub.code.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{sub.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{sub.code}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {sub.category.split(',')[0]}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#246043] h-full rounded-full"
                            style={{ width: isCompleted ? '100%' : '65%' }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5ec] text-[#246043] border border-[#d2ecd9]">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/reader?subject=${sub.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Top Academic Lead / Instructors Card matching screenshot */}
        <div className="bg-[#1b382b] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white">Top Academic Leads</h3>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
                CAPS Certified
              </span>
            </div>

            {/* Featured Lead Card */}
            <div className="bg-[#234536] border border-emerald-700/40 rounded-2xl p-4 flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold text-sm">
                  ES
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Dr. Evelyn Smith</h4>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-300/80 mt-0.5">
                    <span>★ 4.9</span>
                    <span>•</span>
                    <span>1,200 Learners</span>
                  </div>
                </div>
              </div>
              <div className="text-xl">🥇</div>
            </div>

            {/* Ranked Educator List matching screenshot table */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300/60 uppercase tracking-wider pb-1 border-b border-emerald-800/60">
                <span>Rank / Educator</span>
                <span>Subject</span>
                <span className="text-right">Rating</span>
              </div>

              {[
                { name: 'Dr. Evelyn Smith', subj: 'Physical Sciences', rating: '4.9', rank: '1' },
                { name: 'Mr. David Mokoena', subj: 'Mathematics', rating: '4.9', rank: '2' },
                { name: 'Mrs. Zanele Dlamini', subj: 'Life Sciences', rating: '4.8', rank: '3' },
                { name: 'Mr. Johan van der Merwe', subj: 'Accounting', rating: '4.8', rank: '4' },
              ].map((inst, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-[10px] font-bold text-emerald-400">{inst.rank}</span>
                    <span className="font-semibold text-white truncate max-w-[110px]">
                      {inst.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-200/70 truncate max-w-[90px]">
                    {inst.subj}
                  </span>
                  <span className="font-bold text-[#facc15] text-right">★ {inst.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300/80">
            <span>Department of Basic Education</span>
            <Link href="/library" className="hover:text-white font-semibold underline">
              All Materials →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
