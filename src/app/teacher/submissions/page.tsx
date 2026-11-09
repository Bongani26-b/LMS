'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  Award,
  ArrowLeft,
  FileText,
  User,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { LearnerSubmission, Assessment, Subject } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TeacherMarkbookPage() {
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('all');

  useEffect(() => {
    setSubmissions(AppStore.getSubmissions());
    setAssessments(AppStore.getAssessments());
    setSubjects(AppStore.getSubjects());
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedAssessmentId !== 'all' && sub.assessment_id !== selectedAssessmentId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!sub.learner_id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Teacher Studio</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Official Markbook & Submission Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learner Assessment Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review completed student tests, audit scored responses, and monitor subject performance trends.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by learner identifier or student ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedAssessmentId}
            onChange={(e) => setSelectedAssessmentId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Assessments</option>
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Markbook Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No Submissions Found</p>
            <p className="text-[11px] mt-0.5">
              Learners who complete quizzes or exercises will have their graded records logged here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Learner</th>
                  <th className="py-3 px-4 font-semibold">Assessment</th>
                  <th className="py-3 px-4 font-semibold">Score Achieved</th>
                  <th className="py-3 px-4 font-semibold">Percentage</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Feedback Given</th>
                  <th className="py-3 px-4 font-semibold">Submission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => {
                  const asmt = assessments.find((a) => a.id === sub.assessment_id);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                          L
                        </div>
                        <span>{sub.learner_id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {asmt?.title || sub.assessment_id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sub.total_score} marks
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black ${
                            sub.percentage >= 75
                              ? 'text-emerald-600'
                              : sub.percentage >= 50
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          {sub.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {sub.feedback || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(sub.submitted_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

