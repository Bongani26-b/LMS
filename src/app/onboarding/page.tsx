'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  User,
  School as SchoolIcon,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { School, Grade, Subject, UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  // Wizard Steps:
  // 1: Name & Account (First Name, Last Name, Email, Password, School)
  // 2: Grade Selection (Grade 8, 9, 10, 11, 12)
  // 3: Subject Selection (Select the subjects you want to study)
  // 4: Confirmation & Enter Dashboard
  const [step, setStep] = useState<number>(1);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('sch-001');
  const [selectedGradeId, setSelectedGradeId] = useState('grade-10');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Loaded database items
  const [schools, setSchools] = useState<School[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSchools(AppStore.getSchools());
    setGrades(AppStore.getGrades());
  }, []);

  // Update subjects dynamically when grade changes
  useEffect(() => {
    if (selectedGradeId) {
      const subs = AppStore.getSubjectsByGrade(selectedGradeId);
      setAvailableSubjects(subs);
      // Pre-select first 4 subjects by default so learner has a great starting set
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
        setFormError('Please enter a valid school or personal email address.');
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

    const school = schools.find((s) => s.id === selectedSchoolId);
    const grade = grades.find((g) => g.id === selectedGradeId);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: fullName,
      role: 'learner',
      school_id: selectedSchoolId,
      school_name: school?.name || 'Pretoria Boys High School',
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
    }, 600);
  };

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);
  const selectedGrade = grades.find((g) => g.id === selectedGradeId);
  const chosenSubjects = availableSubjects.filter((s) => selectedSubjectIds.includes(s.id));

  return (
    <div className="min-h-screen bg-[#f1f5f2] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      {/* Top Brand Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200/80 shadow-2xs mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#1b382b] text-white flex items-center justify-center font-bold text-xs">
            <GraduationCap className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">QraStudy LMS</span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Grades 8–12
          </span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Learner Registration & Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Set up your learner profile in 3 simple steps to access approved CAPS textbooks, practice quizzes, and your AI study assistant.
        </p>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6">
          {[
            { num: 1, label: 'Name & Info' },
            { num: 2, label: 'Select Grade' },
            { num: 3, label: 'Choose Subjects' },
            { num: 4, label: 'Ready' },
          ].map((s) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#1b382b] text-white ring-4 ring-emerald-200'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline-block ml-2 text-xs font-semibold mr-2 ${
                  step === s.num ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && <div className="w-4 sm:w-8 h-0.5 bg-slate-200 mr-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Required Information</p>
              <p className="mt-0.5">{formError}</p>
            </div>
          </div>
        )}

        {/* STEP 1: FIRST & LAST NAME + ACCOUNT DETAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-700" />
                Step 1: What is your name?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your first and last name as recorded at your school.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Thabo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Nkosi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. thabo.nkosi@student.school.za"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Your School *
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-all"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.province})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GRADE SELECTION (GRADES 8 TO 12) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                Step 2: Which grade are you studying?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your current secondary school grade level (Grades 8–12).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {grades.map((g) => {
                const isSelected = selectedGradeId === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGradeId(g.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1b382b] bg-[#1b382b]/5 ring-2 ring-[#1b382b]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-black text-base text-slate-900">{g.name}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#1b382b] bg-[#1b382b] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 w-fit">
                      {g.phase}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SUBJECT SELECTION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                Step 3: Which subjects do you want to study?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your subjects for <strong className="text-slate-800">{selectedGrade?.name}</strong>. You can choose all that apply.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {availableSubjects.map((sub) => {
                const isSelected = selectedSubjectIds.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleToggleSubject(sub.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-[#1b382b] bg-[#1b382b]/5 ring-2 ring-[#1b382b]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{sub.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold">
                          {sub.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{sub.description}</p>
                      <span className="inline-block mt-2 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        {sub.category}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#1b382b] bg-[#1b382b] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & ACCESS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Step 4: Confirm Your Registration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Verify your details. Everything is configured and ready for your dashboard.
              </p>
            </div>

            <div className="bg-[#f1f5f2] rounded-2xl p-5 border border-slate-200/80 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5">Learner Name:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {firstName} {lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address:</span>
                  <span className="font-bold text-slate-900 text-sm">{email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Selected School:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedSchool?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Grade Level:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedGrade?.name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-slate-500 font-bold block mb-2">
                  Enrolled Subjects ({chosenSubjects.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {chosenSubjects.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {s.name} ({s.code})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b382b] hover:bg-[#244b3a] text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteRegistration}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Activating Profile...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm & Enter Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
