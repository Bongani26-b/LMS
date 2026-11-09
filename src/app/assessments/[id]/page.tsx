'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  Sparkles,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Assessment, AssessmentQuestion, LearnerSubmission } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AssessmentRunnerPage() {
  const params = useParams();
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
      <Card className="max-w-md mx-auto my-20 p-8 text-center border-slate-100 shadow-xs">
        <h2 className="text-base font-bold text-slate-800">Assessment Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          This assessment is not available or has been archived.
        </p>
        <Link href="/assessments" className="mt-4 inline-block">
          <Button className="rounded-full bg-[#1b382b] hover:bg-[#142a20] text-xs h-9 px-5">
            Back to Assessments
          </Button>
        </Link>
      </Card>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/assessments"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#1b382b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Assessments</span>
        </Link>
        <Badge variant="secondary" className="bg-[#e8f5ec] text-[#1b382b] font-bold text-[10px] uppercase">
          CAPS Formative Test
        </Badge>
      </div>

      {/* Assessment Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#e8f5ec] text-[#1b382b] mb-2 inline-block">
              {assessment.assessment_type.toUpperCase()}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{assessment.title}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{assessment.description}</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
            <span className="text-xs text-slate-400 block font-medium">Total Marks</span>
            <span className="text-2xl font-black text-slate-900">{assessment.total_marks}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Pass mark: {assessment.passing_marks} marks
            </span>
          </div>
        </div>

        {/* Results Banner if completed */}
        {submission && (
          <div className="mt-6 p-4 rounded-2xl bg-[#f1f5f2] border border-[#e8f5ec] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  submission.percentage >= 50
                    ? 'bg-[#1b382b] text-white shadow-xs'
                    : 'bg-amber-100 text-amber-800'
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

            <span className="text-xs font-bold px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-center shadow-xs">
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
            <Card
              key={q.id}
              className={`p-6 transition-all border-slate-100 ${
                submission
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-red-300 bg-red-50/20'
                  : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="font-bold text-sm text-slate-900">
                  Question {idx + 1}
                  <span className="font-normal text-xs text-slate-400 ml-2">({q.marks} marks)</span>
                </span>

                {submission && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
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

              <p className="text-sm text-slate-800 mb-5 leading-relaxed font-semibold">
                {q.question_text}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {q.options?.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === opt;
                  const isThisCorrectAnswer = submission && opt === q.correct_answer;

                  let borderClass = 'border-slate-200 hover:border-slate-300';
                  let bgClass = 'bg-white';

                  if (submission) {
                    if (isThisCorrectAnswer) {
                      borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (isThisSelected && !isCorrect) {
                      borderClass = 'border-red-500 bg-red-50 text-red-950';
                    }
                  } else if (isThisSelected) {
                    borderClass = 'border-[#1b382b] bg-[#e8f5ec] font-semibold text-[#1b382b] ring-2 ring-[#1b382b]/20';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm ${borderClass} ${bgClass}`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                          isThisSelected
                            ? 'border-[#1b382b] bg-[#1b382b] text-white'
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
                <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block mb-1">
                    Curriculum Explanation:
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Submission Action */}
      {!submission && (
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Answered {answeredCount} of {questions.length} questions
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Review your answers before submitting. Your grade is saved directly to your profile.
            </p>
          </div>

          <Button
            type="button"
            disabled={isSubmitting || !isAllAnswered}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 h-11 rounded-2xl bg-[#1b382b] hover:bg-[#142a20] text-white text-xs font-bold shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Scoring Assessment...' : 'Submit Answers & Calculate Score'}
          </Button>
        </div>
      )}
    </div>
  );
}
