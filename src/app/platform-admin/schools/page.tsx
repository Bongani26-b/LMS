'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  School as SchoolIcon,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Plus,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { School } from '@/types';

export default function SchoolsRegistryPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSchools(AppStore.getSchools());
  }, []);

  const handleApprove = (id: string) => {
    const all = AppStore.getSchools();
    const target = all.find((s) => s.id === id);
    if (target) {
      target.status = 'active';
      setSchools([...all]);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('dss_lms_schools', JSON.stringify(all));
      }
    }
  };

  const filtered = schools.filter((s) => {
    if (provinceFilter !== 'all' && s.province !== provinceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !(s.ems_code || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const provinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/platform-admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Platform Governance</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-2">
            <SchoolIcon className="w-3.5 h-3.5" />
            <span>National Educational Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registered Secondary Schools
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official DBE registry of participating public and independent secondary schools.
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
            placeholder="Search by school name or EMS code..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Provinces</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">School Name</th>
                <th className="py-3 px-4 font-semibold">EMS Code</th>
                <th className="py-3 px-4 font-semibold">Province</th>
                <th className="py-3 px-4 font-semibold">Contact Email</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
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
                        onClick={() => handleApprove(s.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Approve School
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Verified Active</span>
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

