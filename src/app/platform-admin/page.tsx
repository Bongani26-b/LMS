'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  School as SchoolIcon,
  BookOpen,
  Cpu,
  Settings,
  CheckCircle2,
  Clock,
  Database,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { School, Subject, Grade } from '@/types';

export default function PlatformAdminPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [aiSettings, setAiSettings] = useState(AppStore.getAISettings());

  useEffect(() => {
    setSchools(AppStore.getSchools());
    setSubjects(AppStore.getSubjects());
    setGrades(AppStore.getGrades());
  }, []);

  const handleApproveSchool = (schoolId: string) => {
    const all = AppStore.getSchools();
    const target = all.find((s) => s.id === schoolId);
    if (target) {
      target.status = 'active';
      setSchools([...all]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Department of Basic Education Platform Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Administration & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System-wide curriculum standards, school approvals, AI inference configuration, and database integrity.
          </p>
        </div>

        <Link
          href="/platform-admin/ai-settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Cpu className="w-4 h-4" />
          <span>Configure AI & Inference</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Registered Schools
          </span>
          <span className="text-2xl font-black text-slate-900">{schools.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Across Gauteng, Western Cape, KZN</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Curricula Active
          </span>
          <span className="text-2xl font-black text-blue-600">CAPS 2026.1</span>
          <p className="text-[11px] text-slate-400 mt-1">Grades 8 to 12 Standards</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Master Subjects</span>
          <span className="text-2xl font-black text-emerald-600">{subjects.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Languages, Sciences, Commerce, Tech</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">AI Provider Mode</span>
          <span className="text-sm font-bold text-purple-700 capitalize">
            {aiSettings.provider.replace('_', ' ')}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Model: {aiSettings.ollama_model}</p>
        </div>
      </div>

      {/* Registered Schools Management & Verification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SchoolIcon className="w-5 h-5 text-blue-600" />
              National School Verification & Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and approve secondary institutions requesting platform access.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">School Name</th>
                <th className="py-3 px-4 font-semibold">EMS Code</th>
                <th className="py-3 px-4 font-semibold">Province</th>
                <th className="py-3 px-4 font-semibold">Admin Contact</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.ems_code || 'Pending'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.province}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.contact_email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${
                        s.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.status === 'pending_approval' ? (
                      <button
                        type="button"
                        onClick={() => handleApproveSchool(s.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Approve School
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

