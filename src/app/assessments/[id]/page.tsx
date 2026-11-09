'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ClipboardCheck,
  Check,
  X,
  AlertCircle,
  Award,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Assessment, AssessmentQuestion, LearnerSubmission } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function AssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params?.id as string;
  const { user } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<LearnerSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      const allAsmts = AppStore.getAssessments();
      const found = allAsmts.find((a) => a.id === assessmentId);
      if (found) {
        setAssessment(found);
        setQuestions(AppStore.getQuestions(found.id));
      }

      if (user) {
        const existingSubmissions = AppStore.getSubmissions(user.id);
        const existing = existingSubmissions.find((s) => s.assessment_id === assessmentId);
        if (existing) {
          setSubmission(existing);
          setUserAnswers(existing.answers);
        }
      }
    }
  }, [assessmentId, user]);

  const handleSelectOption = (questionId: string, option: string) => {
    if (submission) return; // Prevent changing after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    if (!user || !assessment) return;
    setIsSubmitting(true);

    const result = AppStore.submitAssessment(assessment.id, user.id, userAnswers);
    setSubmission(result);
    setIsSubmitting(false);
  };

  if (!assessment) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-base font-bold text-slate-800">Assessment Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          This assessment is not available or has been archived.
        </p>
        <Link
          href="/assessments"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Assessments
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Assessments</span>
        </Link>
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
          CAPS Formative Test
        </span>
      </div>

      {/* Assessment Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2 inline-block">
              {assessment.assessment_type.toUpperCase()}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{assessment.title}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{assessment.description}</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
            <span className="text-xs text-slate-400 block">Total Marks:</span>
            <span className="text-2xl font-black text-slate-900">{assessment.total_marks}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Pass mark: {assessment.passing_marks} marks
            </span>
          </div>
        </div>

        {/* Results Banner if completed */}
        {submission && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                  submission.percentage >= 50
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {submission.percentage}%
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {submission.percentage >= 75
                    ? 'Distinction Achieved!'
                    : submission.percentage >= 50
                    ? 'Competency Achieved'
                    : 'Further Revision Recommended'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">{submission.feedback}</p>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-center">
              Recorded in Academic Profile
            </span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = submission && selectedOption === q.correct_answer;
          const isWrong = submission && selectedOption !== q.correct_answer;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                submission
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : 'border-red-300 bg-red-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="font-bold text-sm text-slate-900">
                  Question {idx + 1}
                  <span className="font-normal text-xs text-slate-400 ml-2">({q.marks} marks)</span>
                </span>

                {submission && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-800 mb-4 leading-relaxed font-medium">
                {q.question_text}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options?.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === opt;
                  const isThisCorrectAnswer = submission && opt === q.correct_answer;

                  let borderClass = 'border-slate-200 hover:border-slate-300';
                  let bgClass = 'bg-white';

                  if (submission) {
                    if (isThisCorrectAnswer) {
                      borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isThisSelected && !isCorrect) {
                      borderClass = 'border-red-500 bg-red-50 text-red-900';
                    }
                  } else if (isThisSelected) {
                    borderClass = 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm ${borderClass} ${bgClass}`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isThisSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isThisSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submission && q.explanation && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Curriculum Explanation:
                  </span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Action */}
      {!submission && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-700 block">
              Answered {answeredCount} of {questions.length} questions
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Review your answers before submitting. Your score will be calculated immediately.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting || !isAllAnswered}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
          >
            {isSubmitting ? 'Scoring Assessment...' : 'Submit Answers & Calculate Score'}
          </button>
        </div>
      )}
    </div>
  );
}

