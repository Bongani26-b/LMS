'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  School as SchoolIcon,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Check,
  ArrowLeft,
  BookOpen,
  Award,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AppStore } from '@/lib/store/appStore';
import { Subject, LearnerSubmission } from '@/types';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      const allSubs = AppStore.getSubjects();
      const userSubs = (user.enrolled_subject_ids || []).map((id) =>
        allSubs.find((s) => s.id === id)
      ).filter(Boolean) as Subject[];
      setSubjects(userSubs.length > 0 ? userSubs : allSubs.filter((s) => s.grade_id === user.grade_id));
      setSubmissions(AppStore.getSubmissions(user.id));
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updated = {
      ...user,
      phone: phone.trim(),
      updated_at: new Date().toISOString(),
    };

    AppStore.setCurrentUser(updated);
    setUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.full_name}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.school_name} • {user?.grade_name || 'Secondary Education'}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
            Status: {user?.registration_status?.toUpperCase() || 'ACTIVE'}
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile contact details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Legal Full Name</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </label>
              <input
                type="text"
                value={user?.full_name || ''}
                disabled
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Student / School Email</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Verified
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Registered Secondary School</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Administration Managed
                </span>
              </label>
              <input
                type="text"
                value={user?.school_name || 'Pretoria Boys High'}
                disabled
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Grade Level</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Annual Promotion
                </span>
              </label>
              <input
                type="text"
                value={user?.grade_name || 'Grade 10'}
                disabled
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency / Guardian Contact Phone (Permitted update)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 82 123 4567"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Update Contact Information
            </button>
          </div>
        </form>

        {/* Enrolled Subjects List */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Enrolled Subjects ({subjects.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{sub.name}</span>
                  <span className="block text-[10px] text-slate-400">{sub.category}</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">
                  {sub.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

