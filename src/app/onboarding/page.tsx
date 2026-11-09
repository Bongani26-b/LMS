'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  User,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Grade, Subject, UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  // Streamlined 3-step student onboarding:
  // 1: Name & Account (First Name, Last Name, Email, Password - NO SCHOOL REQUIRED)
  // 2: Grade Selection (Grade 8, 9, 10, 11, or 12)
  // 3: Select Subjects to Study
  // 4: Confirmation & Instant Dashboard Entry
  const [step, setStep] = useState<number>(1);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('grade-10');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Loaded database items
  const [grades, setGrades] = useState<Grade[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setGrades(AppStore.getGrades());
  }, []);

  // Update subjects dynamically when grade changes
  useEffect(() => {
    if (selectedGradeId) {
      const subs = AppStore.getSubjectsByGrade(selectedGradeId);
      setAvailableSubjects(subs);
      // Pre-select first 4 subjects by default so learner has an immediate great starting set
      if (subs.length > 0) {
        setSelectedSubjectIds(subs.slice(0, Math.min(4, subs.length)).map((s) => s.id));
      }
    }
  }, [selectedGradeId]);

  const handleToggleSubject = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    setFormError(null);
    if (currentStep === 1) {
      if (!firstName.trim()) {
        setFormError('Please enter your first name.');
        return false;
      }
      if (!lastName.trim()) {
        setFormError('Please enter your last name.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setFormError('Please enter a valid email address.');
        return false;
      }
      if (password.length > 0 && password.length < 6) {
        setFormError('Password must be at least 6 characters.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!selectedGradeId) {
        setFormError('Please select the grade you are studying (Grades 8 to 12).');
        return false;
      }
    } else if (currentStep === 3) {
      if (selectedSubjectIds.length === 0) {
        setFormError('Please select at least one subject you want to study.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setFormError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleCompleteRegistration = () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);

    const grade = grades.find((g) => g.id === selectedGradeId);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Student account - strictly role: 'learner' (cannot switch to teacher or admin)
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: fullName,
      role: 'learner',
      school_id: 'default-student-portal',
      school_name: 'Secondary Education Portal',
      grade_id: selectedGradeId,
      grade_name: grade?.name || 'Grade 10',
      registration_status: 'active',
      enrolled_subject_ids: selectedSubjectIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    AppStore.setCurrentUser(newProfile);
    setUser(newProfile);

    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  const selectedGrade = grades.find((g) => g.id === selectedGradeId);
  const chosenSubjects = availableSubjects.filter((s) => selectedSubjectIds.includes(s.id));

  return (
    <div className="min-h-screen bg-[#f1f5f2] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      {/* Top Brand Header */}
      <div className="text-center mb-8 max-w-lg">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#1b382b] text-white flex items-center justify-center font-bold text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <span className="font-bold text-slate-900 text-xs tracking-tight">QraStudy</span>
          <Badge variant="secondary">Student Portal</Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Create Your Student Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tell us your name, grade, and subjects to unlock your textbooks, video lessons, and AI tutor.
        </p>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[
            { num: 1, label: 'Your Name' },
            { num: 2, label: 'Select Grade' },
            { num: 3, label: 'Choose Subjects' },
            { num: 4, label: 'Ready' },
          ].map((s) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#1b382b] text-white ring-4 ring-emerald-200'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline-block ml-1.5 text-xs font-bold mr-2 ${
                  step === s.num ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && <div className="w-4 sm:w-6 h-0.5 bg-slate-200 mr-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 relative overflow-hidden">
        {formError && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Required Information</p>
              <p className="mt-0.5">{formError}</p>
            </div>
          </div>
        )}

        {/* STEP 1: FIRST & LAST NAME + EMAIL (NO SCHOOL QUESTION) */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                Step 1: What is your name?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your first and last name to set up your learner dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  First Name *
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Thabo"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Name *
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Nkosi"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. thabo@student.com"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (Optional)
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password or leave default"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GRADE SELECTION (GRADES 8 TO 12) */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                Step 2: Which grade are you in?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your secondary school grade level (Grades 8 to 12).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {grades.map((g) => {
                const isSelected = selectedGradeId === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGradeId(g.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1b382b] bg-[#1b382b]/5 ring-2 ring-[#1b382b]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-base text-slate-900">{g.name}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#1b382b] bg-[#1b382b] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit text-[9px]">
                      {g.phase}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SUBJECT SELECTION */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Step 3: Which subjects do you want to study?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select subjects for <strong className="text-slate-800">{selectedGrade?.name}</strong>. Textbooks, videos, and AI will be customized for these.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {availableSubjects.map((sub) => {
                const isSelected = selectedSubjectIds.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleToggleSubject(sub.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-[#1b382b] bg-[#1b382b]/5 ring-2 ring-[#1b382b]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{sub.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold">
                          {sub.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {sub.description}
                      </p>
                      <Badge variant="secondary" className="mt-1.5 text-[9px]">
                        {sub.category}
                      </Badge>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-[#1b382b] bg-[#1b382b] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: READY & CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Step 4: Everything is Ready!
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your student details to activate your customized dashboard.
              </p>
            </div>

            <div className="bg-[#f1f5f2] rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Learner Name:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {firstName} {lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Grade Level:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedGrade?.name}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold block mb-1.5 text-[11px]">
                  Enrolled Subjects ({chosenSubjects.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chosenSubjects.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-800 shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button type="button" size="sm" onClick={handleNext}>
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="emerald"
              size="sm"
              onClick={handleCompleteRegistration}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Starting Dashboard...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Enter My Dashboard</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
