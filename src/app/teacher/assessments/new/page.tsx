'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ClipboardCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, Grade, AssessmentType, AssessmentQuestion } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function NewAssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [gradeId, setGradeId] = useState('grade-10');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('quiz');
  const [timeLimit, setTimeLimit] = useState<number>(20);

  // Dynamic questions list
  const [questions, setQuestions] = useState<
    Array<{
      question_text: string;
      options: string[];
      correct_answer: string;
      explanation: string;
      marks: number;
    }>
  >([
    {
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      marks: 5,
    },
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const allSubs = AppStore.getSubjects();
    setSubjects(allSubs);
    setGrades(AppStore.getGrades());
    if (allSubs.length > 0) {
      setSubjectId(allSubs[0].id);
    }
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        marks: 5,
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const totalCalculatedMarks = questions.reduce((acc, q) => acc + (q.marks || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    setIsSubmitting(true);

    const newAssessment = {
      id: `asmt-${Date.now()}`,
      school_id: user?.school_id || 'sch-001',
      subject_id: subjectId,
      grade_id: gradeId,
      title: title.trim(),
      description: description.trim(),
      assessment_type: assessmentType,
      total_marks: totalCalculatedMarks,
      passing_marks: Math.round(totalCalculatedMarks * 0.5),
      time_limit_minutes: timeLimit,
      created_by: user?.id || 'teacher-001',
      is_published: true,
      created_at: new Date().toISOString(),
    };

    // Save assessment to store
    const allAsmts = AppStore.getAssessments();
    allAsmts.unshift(newAssessment);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dss_lms_assessments', JSON.stringify(allAsmts));
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/teacher');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Teacher Studio</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Curriculum Assessment Authoring</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Create New Assessment</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build formative quizzes or summative tests aligned with CAPS standards for your classes.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-emerald-900">Assessment Published</h3>
            <p className="text-xs text-emerald-700">
              The assessment is now active and ready for enrolled learners.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 10 Physical Sciences: Chemical Systems Test"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions & Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Instructions for learners (e.g. Answer all questions. Scientific calculators permitted)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grade Level *
                  </label>
                  <select
                    value={gradeId}
                    onChange={(e) => setGradeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="quiz">Quick Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="test">Class Test</option>
                    <option value="exam">Examination</option>
                    <option value="practice">Practice Exercise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Limit (Mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Questions ({questions.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Total Marks: {totalCalculatedMarks}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-700">Question {qIdx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.question_text}
                    onChange={(e) => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                    placeholder="Enter question text (e.g. Which bonding type involves sharing electrons?)..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-4">
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Correct Answer (Must match one option exactly) *
                      </label>
                      <input
                        type="text"
                        value={q.correct_answer}
                        onChange={(e) =>
                          handleQuestionChange(qIdx, 'correct_answer', e.target.value)
                        }
                        placeholder="e.g. Covalent bond"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Question Marks
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={q.marks}
                        onChange={(e) =>
                          handleQuestionChange(qIdx, 'marks', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Curriculum Explanation (Shown to learners after submission)
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                      placeholder="Brief pedagogical reason why this answer is correct according to CAPS..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Assessment to Classes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

