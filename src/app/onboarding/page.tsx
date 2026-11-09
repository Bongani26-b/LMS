'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  School as SchoolIcon,
  BookOpen,
  User,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { School, Grade, Subject, UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  // Wizard Steps: 1: Account, 2: School, 3: Grade, 4: Subjects, 5: Confirmation
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // School Registration Modal / New School inputs
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolProvince, setNewSchoolProvince] = useState('Gauteng');
  const [newSchoolEmail, setNewSchoolEmail] = useState('');

  // Data loaded from database/store
  const [schools, setSchools] = useState<School[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSchools(AppStore.getSchools());
    setGrades(AppStore.getGrades());
  }, []);

  // When grade changes, load corresponding subjects
  useEffect(() => {
    if (selectedGradeId) {
      const subjects = AppStore.getSubjectsByGrade(selectedGradeId);
      setAvailableSubjects(subjects);
      // Reset selected subjects if grade changes
      setSelectedSubjectIds([]);
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedGradeId]);

  // Handle adding new school
  const handleAddNewSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolEmail) return;

    const created = AppStore.addSchool({
      name: newSchoolName,
      province: newSchoolProvince,
      status: 'pending_approval',
      contact_email: newSchoolEmail,
    });

    setSchools(AppStore.getSchools());
    setSelectedSchoolId(created.id);
    setShowAddSchool(false);
    setNewSchoolName('');
    setNewSchoolEmail('');
  };

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
      if (!fullName.trim()) {
        setFormError('Please enter your full legal name as it appears on your birth certificate or ID.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setFormError('Please enter a valid school or personal email address.');
        return false;
      }
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters long.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!selectedSchoolId) {
        setFormError('Please select your registered secondary school or submit a new school request.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!selectedGradeId) {
        setFormError('Please select the grade you are currently attending (Grade 8 to 12).');
        return false;
      }
    } else if (currentStep === 4) {
      if (selectedSubjectIds.length === 0) {
        setFormError('Please select at least 1 subject to continue. (CAPS learners typically take 7 subjects in Grades 10–12).');
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
    if (!validateStep(5)) return;
    setIsSubmitting(true);

    const school = schools.find((s) => s.id === selectedSchoolId);
    const grade = grades.find((g) => g.id === selectedGradeId);

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: fullName.trim(),
      role: 'learner',
      school_id: selectedSchoolId,
      school_name: school?.name || 'Selected Secondary School',
      grade_id: selectedGradeId,
      grade_name: grade?.name || 'Secondary Grade',
      registration_status: school?.status === 'pending_approval' ? 'pending_approval' : 'active',
      enrolled_subject_ids: selectedSubjectIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    AppStore.setCurrentUser(newProfile);
    setUser(newProfile);

    // Redirect directly to the personalized learner dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);
  const selectedGrade = grades.find((g) => g.id === selectedGradeId);
  const chosenSubjects = availableSubjects.filter((s) => selectedSubjectIds.includes(s.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      {/* Step Indicator Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Learner Registration & Onboarding</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Join the Digital Secondary School
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          Enroll in your school, select your grade level, and choose your official CAPS subjects to configure your personalized learning environment.
        </p>

        {/* Wizard progress bar */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[
            { num: 1, label: 'Account' },
            { num: 2, label: 'School' },
            { num: 3, label: 'Grade' },
            { num: 4, label: 'Subjects' },
            { num: 5, label: 'Confirm' },
          ].map((s) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-700 mr-2">
                {s.label}
              </span>
              {s.num < 5 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 mr-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Verification Alert</p>
              <p className="text-xs mt-0.5">{formError}</p>
            </div>
          </div>
        )}

        {/* STEP 1: ACCOUNT DETAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Step 1: Learner Account Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your official student credentials. Real names are required for academic records and certificate issuance.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name (as on Identity Document / Birth Certificate) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Thabo Nkosi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (School-issued or Personal) *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. thabo.nkosi@student.school.za"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We use this for assessment notifications and document access.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCHOOL SELECTION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <SchoolIcon className="w-5 h-5 text-blue-600" />
                Step 2: Select Your Registered Secondary School
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose the school you are enrolled in. Resources and assessments are verified per school.
              </p>
            </div>

            <div className="space-y-3">
              {schools.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSchoolId(s.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    selectedSchoolId === s.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900">{s.name}</h4>
                      {s.ems_code && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {s.ems_code}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {s.province} {s.district ? `• ${s.district}` : ''}
                    </p>
                    {s.status === 'pending_approval' && (
                      <span className="inline-block mt-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Pending School Administration Verification
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedSchoolId === s.id
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedSchoolId === s.id && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>

            {/* School Request/Registration option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAddSchool(!showAddSchool)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Can&apos;t find your school? Register a new school</span>
              </button>

              {showAddSchool && (
                <form
                  onSubmit={handleAddNewSchool}
                  className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-900">Register New Secondary School</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        School Name *
                      </label>
                      <input
                        type="text"
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                        placeholder="e.g. Lawson Secondary School"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Province *
                      </label>
                      <select
                        value={newSchoolProvince}
                        onChange={(e) => setNewSchoolProvince(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Gauteng">Gauteng</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Northern Cape">Northern Cape</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Official School Administration Email *
                    </label>
                    <input
                      type="email"
                      value={newSchoolEmail}
                      onChange={(e) => setNewSchoolEmail(e.target.value)}
                      placeholder="e.g. admin@school.gov.za"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Submit School for Approval
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: GRADE SELECTION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Step 3: Select Your Grade (Grades 8–12)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Curriculum standards and subject offerings are tailored to Senior Phase (Grades 8–9) and Further Education & Training (Grades 10–12).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {grades.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGradeId(g.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedGradeId === g.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-slate-900">{g.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedGradeId === g.id
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedGradeId === g.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                      {g.phase}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SUBJECT SELECTION */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Step 4: Select Your Registered Subjects
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Displaying official CAPS subjects for{' '}
                <strong className="text-slate-700">{selectedGrade?.name}</strong> at{' '}
                <strong className="text-slate-700">{selectedSchool?.name}</strong>.
              </p>
            </div>

            {availableSubjects.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">
                  No subjects configured for this grade level yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjectIds.includes(sub.id);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleToggleSubject(sub.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-900">{sub.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {sub.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{sub.description}</p>
                        <span className="inline-block mt-2 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                          {sub.category}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Step 5: Confirm Onboarding Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Please verify your details. After confirmation, your account will be activated and your dashboard configured.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Legal Name:</span>
                  <span className="font-semibold text-slate-900 text-sm">{fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address:</span>
                  <span className="font-semibold text-slate-900 text-sm">{email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Enrolled School:</span>
                  <span className="font-semibold text-slate-900 text-sm">{selectedSchool?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Grade Level:</span>
                  <span className="font-semibold text-slate-900 text-sm">{selectedGrade?.name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-slate-500 text-xs font-semibold block mb-2">
                  Enrolled Subjects ({chosenSubjects.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {chosenSubjects.map((sub) => (
                    <span
                      key={sub.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      {sub.name} ({sub.code})
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteRegistration}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Configuring Dashboard...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm & Access Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

