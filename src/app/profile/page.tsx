'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#1b382b] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <Card className="p-6 sm:p-8 space-y-6 border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#1b382b] text-white flex items-center justify-center font-black text-2xl shadow-xs">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.full_name}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.grade_name || 'Grade 10'} • Secondary Student
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="bg-[#e8f5ec] text-[#1b382b] font-bold text-xs px-3 py-1 self-start sm:self-center">
            Role: Learner (Locked)
          </Badge>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-[#e8f5ec] rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-[#246043]" />
            <span>Profile contact details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Legal Full Name</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </label>
              <input
                type="text"
                value={user?.full_name || ''}
                disabled
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-100/70 text-slate-600 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Student Email</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                  <Lock className="w-3 h-3" /> Verified
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-100/70 text-slate-600 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Curriculum</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                  <Lock className="w-3 h-3" /> CAPS Standard
                </span>
              </label>
              <input
                type="text"
                value="South African CAPS"
                disabled
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-100/70 text-slate-600 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Grade Level</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                  <Lock className="w-3 h-3" /> Enrolled
                </span>
              </label>
              <input
                type="text"
                value={user?.grade_name || 'Grade 10'}
                disabled
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-100/70 text-slate-600 cursor-not-allowed font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency / Guardian Contact Phone (Permitted update)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 82 123 4567"
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              className="rounded-full bg-[#1b382b] hover:bg-[#142a20] text-white text-xs font-bold px-6 h-10 shadow-xs"
            >
              Update Contact Details
            </Button>
          </div>
        </form>

        {/* Enrolled Subjects List */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#246043]" />
            <span>Selected Study Subjects ({subjects.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-[#f8faf9] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{sub.name}</span>
                  <span className="block text-[10px] text-slate-400">{sub.category}</span>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-slate-700">
                  {sub.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
