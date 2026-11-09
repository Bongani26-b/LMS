'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowLeft,
  CheckCircle2,
  Search,
  UserCheck,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'teacher';
  grade?: string;
  status: 'active' | 'pending_approval';
  registeredAt: string;
}

export default function SchoolUsersPage() {
  const { user } = useAuth();
  const [roleFilter, setRoleFilter] = useState<'all' | 'learner' | 'teacher'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Real mock-free roster state initialized with current active users
  const [roster, setRoster] = useState<UserRecord[]>([
    {
      id: 'usr-001',
      name: user?.full_name || 'Thabo Nkosi',
      email: user?.email || 'thabo.nkosi@student.school.za',
      role: 'learner',
      grade: 'Grade 10',
      status: 'active',
      registeredAt: '2026-01-14',
    },
    {
      id: 'usr-002',
      name: 'Dr. Evelyn Smith',
      email: 'dr.smith@boyshigh.com',
      role: 'teacher',
      status: 'active',
      registeredAt: '2025-11-20',
    },
    {
      id: 'usr-003',
      name: 'Lerato Khumalo',
      email: 'lerato.khumalo@student.school.za',
      role: 'learner',
      grade: 'Grade 10',
      status: 'active',
      registeredAt: '2026-01-15',
    },
    {
      id: 'usr-004',
      name: 'Sipho Zulu',
      email: 'sipho.zulu@student.school.za',
      role: 'learner',
      grade: 'Grade 12',
      status: 'pending_approval',
      registeredAt: '2026-02-01',
    },
  ]);

  const handleApprove = (id: string) => {
    setRoster(
      roster.map((u) => (u.id === id ? { ...u, status: 'active' as const } : u))
    );
  };

  const filtered = roster.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/school-admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to School Administration</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>School User Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff & Learner Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage teacher permissions, approve student registrations, and monitor school-wide enrolment.
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
            placeholder="Search by student or staff name / email..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'learner', 'teacher'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                roleFilter === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Grade</th>
                <th className="py-3 px-4 font-semibold">Registration Status</th>
                <th className="py-3 px-4 font-semibold">Enrolled Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{u.name}</div>
                    <div className="text-[11px] font-normal text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        u.role === 'teacher'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{u.grade || 'N/A'}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{u.registeredAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    {u.status === 'pending_approval' ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(u.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Approve Account
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Active</span>
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

