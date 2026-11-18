'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Award, BookOpen, Calendar, CheckCircle2, ChevronRight, Clock, Eye, Search,
  Users, MessageCircle, CalendarPlus, X, Sparkles, FileText,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AppStore } from '@/lib/store/appStore';
import { LearnerSubmission, LearningProgress, Subject } from '@/types';

const progressByTerm: Record<string, number[]> = {
  'Term 1': [22, 31, 29, 45, 52, 58, 63, 68, 72, 78, 82, 85],
  'Term 2': [28, 35, 42, 48, 57, 62, 70, 75, 79, 84, 88, 91],
  'Term 3': [34, 41, 48, 55, 61, 68, 74, 80, 85, 89, 92, 95],
  'Term 4': [40, 47, 54, 62, 69, 76, 82, 86, 90, 94, 96, 98],
};

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const subjectNames = ['Math','Physics','Biology','English','Account','History','Tech'];
const scoredData = [64,58,72,68,82,74,88];
const targetData = [68,70,72,74,76,78,80];

const educators = [
  { name: 'Dr. Evelyn Smith', subject: 'Physical Sciences', rating: '4.9', rank: '1', initials: 'ES', bio: 'CAPS Physical Sciences lead with 14 years of classroom experience.' },
  { name: 'Mr. David Mokoena', subject: 'Mathematics', rating: '4.9', rank: '2', initials: 'DM', bio: 'Mathematics specialist focused on algebra and exam preparation.' },
  { name: 'Mrs. Zanele Dlamini', subject: 'Life Sciences', rating: '4.8', rank: '3', initials: 'ZD', bio: 'Life Sciences educator and practical investigation mentor.' },
  { name: 'Mr. Johan van der Merwe', subject: 'Accounting', rating: '4.8', rank: '4', initials: 'JM', bio: 'Accounting educator with a practical, business-led approach.' },
];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function InteractiveDashboard() {
  const { user } = useAuth();
  const subjectsRef = useRef<HTMLDivElement>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progressRecords, setProgressRecords] = useState<LearningProgress[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [term, setTerm] = useState('Term 1');
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const [showScored, setShowScored] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [studyModal, setStudyModal] = useState(false);
  const [educator, setEducator] = useState<typeof educators[number] | null>(null);
  const [highlightSubjects, setHighlightSubjects] = useState(false);

  useEffect(() => {
    if (!user) return;
    const allSubjects = AppStore.getSubjects();
    const enrolledIds = user.enrolled_subject_ids || [];
    setSubjects(enrolledIds.length ? allSubjects.filter((s) => enrolledIds.includes(s.id)) : allSubjects.filter((s) => s.grade_id === user.grade_id));
    setProgressRecords(AppStore.getProgress(user.id));
    setSubmissions(AppStore.getSubmissions(user.id));
  }, [user]);

  const totalSubjectsCount = subjects.length || 7;
  const completedTopics = progressRecords.filter((p) => p.status === 'completed').length || 12;
  const totalSeconds = progressRecords.reduce((a, p) => a + p.time_spent_seconds, 0);
  const studyHours = totalSeconds > 0 ? (totalSeconds / 3600).toFixed(1) : '18.5';
  const averageScore = submissions.length
    ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / submissions.length)
    : 84;

  const filteredSubjects = useMemo(() => subjects.filter((subject) =>
    `${subject.name} ${subject.code}`.toLowerCase().includes(searchTableQuery.toLowerCase())
  ), [subjects, searchTableQuery]);

  const scrollToSubjects = () => {
    setHighlightSubjects(true);
    subjectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => setHighlightSubjects(false), 1800);
  };

  const curriculum = progressByTerm[term];
  const progressPoints = curriculum.map((value, index) => `${index * (500 / 11)},${165 - value * 1.35}`).join(' ');
  const areaPath = `M 0,165 L ${curriculum.map((value, index) => `${index * (500 / 11)},${165 - value * 1.35}`).join(' L')} L 500,165 Z`;
  const scoredPoints = scoredData.map((value, index) => `${index * (500 / 6)},${165 - value * 1.45}`).join(' ');
  const targetPoints = targetData.map((value, index) => `${index * (500 / 6)},${165 - value * 1.45}`).join(' ');

  const kpis = [
    { label: 'Enrolled Subjects', value: totalSubjectsCount, icon: BookOpen, action: scrollToSubjects },
    { label: 'Topics Mastered', value: completedTopics, icon: CheckCircle2, action: () => setExpandedSubject(subjects[0]?.id || null) },
    { label: 'Academic Average', value: `${averageScore}%`, icon: Award, action: () => setSelectedSubject(0) },
    { label: 'Class Teachers', value: 5, icon: Users, action: () => educator ? undefined : setEducator(educators[0]) },
    { label: 'Study Time', value: `${studyHours}h`, icon: Clock, action: () => setStudyModal(true) },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map(({ label, value, icon: Icon, action }) => (
          <button key={label} type="button" onClick={action} className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5ec] text-[#246043]"><Icon className="h-5 w-5" /></span>
            <span><span className="block text-[11px] font-medium text-slate-400">{label}</span><span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{value}</span></span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h3 className="text-sm font-bold text-slate-900">Curriculum Progress Overview</h3><p className="mt-0.5 text-[11px] text-slate-400">CAPS syllabus mastery across 2026 academic terms</p></div>
            <label className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <select value={term} onChange={(e) => setTerm(e.target.value)} className="bg-transparent outline-none">
                {['Term 1','Term 2','Term 3','Term 4'].map((item) => <option key={item}>{item} (2026)</option>)}
              </select>
            </label>
          </div>
          <div className="relative h-52">
            <svg viewBox="0 0 500 180" className="h-full w-full overflow-visible" role="img" aria-label="Monthly curriculum progress">
              {[30,75,120,165].map((y) => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f1f5f2" />)}
              <path d={areaPath} fill="#246043" fillOpacity="0.12" />
              <polyline points={progressPoints} fill="none" stroke="#246043" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {curriculum.map((value, index) => {
                const x = index * (500 / 11);
                const y = 165 - value * 1.35;
                return <g key={months[index]} onMouseEnter={() => setHoverMonth(index)} onMouseLeave={() => setHoverMonth(null)} className="cursor-pointer"><circle cx={x} cy={y} r="8" fill="transparent" /><circle cx={x} cy={y} r={hoverMonth === index ? 5 : 2.5} fill="#246043" stroke="white" strokeWidth="2" /></g>;
              })}
            </svg>
            {hoverMonth !== null && (
              <div className="pointer-events-none absolute top-0 rounded-xl bg-[#133325] px-3 py-2 text-xs text-white shadow-xl" style={{ left: `${Math.min(82, Math.max(2, hoverMonth / 11 * 100))}%`, transform: 'translateX(-50%)' }}>
                <b>{months[hoverMonth]}</b>: {curriculum[hoverMonth]}% mastery
                <div className="mt-0.5 text-[10px] text-emerald-200">{curriculum[hoverMonth] >= 85 ? 'Milestone reached' : 'In progress'}</div>
              </div>
            )}
            <div className="flex justify-between px-1 text-[9px] font-medium text-slate-400">{months.map((month) => <span key={month}>{month}</span>)}</div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h3 className="text-sm font-bold text-slate-900">Student Analysis</h3><p className="mt-0.5 text-[11px] text-slate-400">Formative test marks & exercise completion</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowScored(!showScored)} className={`flex items-center gap-1.5 text-xs font-medium ${showScored ? 'text-slate-700' : 'text-slate-300'}`}><span className="h-2 w-2 rounded-full bg-[#246043]" />Scored</button>
              <button type="button" onClick={() => setShowTarget(!showTarget)} className={`flex items-center gap-1.5 text-xs font-medium ${showTarget ? 'text-slate-700' : 'text-slate-300'}`}><span className="h-2 w-2 rounded-full bg-slate-300" />Target</button>
            </div>
          </div>
          <div className="relative h-52">
            <svg viewBox="0 0 500 180" className="h-full w-full overflow-visible">
              {[30,75,120,165].map((y) => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f1f5f2" />)}
              {showTarget && <polyline points={targetPoints} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />}
              {showScored && <polyline points={scoredPoints} fill="none" stroke="#246043" strokeWidth="3" strokeLinejoin="round" />}
              {scoredData.map((value, index) => {
                const x = index * (500 / 6); const y = 165 - value * 1.45;
                return <g key={subjectNames[index]} onClick={() => setSelectedSubject(selectedSubject === index ? null : index)} className="cursor-pointer"><circle cx={x} cy={y} r="10" fill={selectedSubject === index ? '#facc15' : 'transparent'} opacity="0.5" /><circle cx={x} cy={y} r={selectedSubject === index ? 6 : 3} fill="#246043" stroke="white" strokeWidth="2" /></g>;
              })}
            </svg>
            <div className="flex justify-between px-1 text-[9px] font-medium text-slate-400">{subjectNames.map((name, index) => <button key={name} type="button" onClick={() => setSelectedSubject(selectedSubject === index ? null : index)} className={selectedSubject === index ? 'rounded-full bg-emerald-100 px-2 py-1 font-bold text-emerald-800' : 'hover:text-slate-700'}>{name}</button>)}</div>
          </div>
        </section>
      </div>

      <div ref={subjectsRef} className="grid scroll-mt-6 grid-cols-1 gap-6 lg:grid-cols-3">
        <section className={`rounded-3xl border bg-white p-6 shadow-sm transition-all duration-500 lg:col-span-2 ${highlightSubjects ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200/80'}`}>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><h3 className="text-sm font-bold text-slate-900">Enrolled Secondary Subjects</h3><p className="mt-0.5 text-[11px] text-slate-400">Official CAPS subjects for {user?.grade_name || 'Grade 10'}</p></div>
            <div className="relative"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input value={searchTableQuery} onChange={(e) => setSearchTableQuery(e.target.value)} placeholder="Search subject..." className="w-48 rounded-full border border-slate-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs"><thead className="border-b border-slate-100 bg-[#f8faf8] text-[10px] font-bold uppercase text-slate-400"><tr><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{filteredSubjects.map((subject, index) => {
                const expanded = expandedSubject === subject.id;
                const progress = 55 + ((index * 11) % 40);
                return (
                  <React.Fragment key={subject.id}>
                    <tr onClick={() => setExpandedSubject(expanded ? null : subject.id)} className="cursor-pointer transition-colors hover:bg-[#f8faf8]"><td className="px-4 py-3.5"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 font-bold text-[#246043]">{subject.code.charAt(0)}</span><span><b className="block text-slate-900">{subject.name}</b><small className="font-mono text-slate-400">{subject.code}</small></span></div></td><td className="px-4 py-3.5 text-slate-500">{subject.category.split(',')[0]}</td><td className="px-4 py-3.5"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} /></div></td><td className="px-4 py-3.5"><span className="rounded-full border border-[#d2ecd9] bg-[#e8f5ec] px-2.5 py-1 text-[10px] font-bold text-[#246043]">Active</span></td><td className="px-4 py-3.5 text-right"><button type="button" onClick={(e) => { e.stopPropagation(); setExpandedSubject(expanded ? null : subject.id); }} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-200"><Eye className="h-3 w-3" />View</button></td></tr>
                    {expanded && <tr><td colSpan={5} className="bg-emerald-50/40 px-5 py-4"><div className="grid gap-4 sm:grid-cols-3"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Recent assignments</p><p className="text-xs font-semibold text-slate-800">Mind map due Friday</p><p className="mt-1 text-[10px] text-slate-500">2 activities remaining</p></div><div><p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Syllabus progress</p><div className="flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-white"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} /></div><b className="text-xs">{progress}%</b></div></div><div className="flex items-end gap-2"><Link href={`/reader?subject=${subject.id}`} className="rounded-lg bg-[#133325] px-3 py-2 text-[11px] font-bold text-white hover:bg-emerald-900">Open Reader</Link><Link href={`/subjects/${subject.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700">View Topics</Link></div></div></td></tr>}
                  </React.Fragment>
                );
              })}</tbody>
            </table>
          </div>
        </section>

        <aside className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#133325] p-6 text-white shadow-sm">
          <div><div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold">Top Academic Leads</h3><span className="rounded-full border border-emerald-700/50 bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300">CAPS Certified</span></div>
            <div className="mb-5 space-y-2">{educators.map((lead) => <button key={lead.name} type="button" onClick={() => setEducator(lead)} className="flex w-full items-center justify-between rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-emerald-700/40 hover:bg-[#234536]"><span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-200">{lead.initials}</span><span><b className="block text-xs">{lead.name}</b><small className="text-[10px] text-emerald-300/70">{lead.subject}</small></span></span><span className="text-xs font-bold text-[#facc15]">★ {lead.rating}</span></button>)}</div>
          </div>
          <Link href="/library" className="flex items-center justify-between border-t border-emerald-800/60 pt-4 text-[11px] text-emerald-300"><span>Department of Basic Education</span><span className="font-semibold text-white">All Materials →</span></Link>
        </aside>
      </div>

      {studyModal && <Modal title="Daily Study Breakdown" onClose={() => setStudyModal(false)}><div className="space-y-3">{[['Monday','3.2h'],['Tuesday','2.8h'],['Wednesday','4.1h'],['Thursday','3.4h'],['Friday','3.0h'],['Weekend','2.0h']].map(([day, hours]) => <div key={day} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="font-medium text-slate-600">{day}</span><b className="text-[#246043]">{hours}</b></div>)}</div></Modal>}
      {educator && <Modal title="Educator Profile" onClose={() => setEducator(null)}><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f5ec] text-lg font-black text-[#246043]">{educator.initials}</span><div><h4 className="font-bold text-slate-900">{educator.name}</h4><p className="text-xs text-emerald-700">{educator.subject} • ★ {educator.rating}</p></div></div><p className="mt-4 text-xs leading-relaxed text-slate-500">{educator.bio}</p><div className="mt-5 grid grid-cols-2 gap-3"><button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-[#133325] px-4 py-3 text-xs font-bold text-white"><CalendarPlus className="h-4 w-4" />Book consultation</button><button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700"><MessageCircle className="h-4 w-4" />Send message</button></div></Modal>}
    </div>
  );
}
