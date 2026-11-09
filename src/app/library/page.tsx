'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  FileText,
  Bookmark,
  Share2,
  Check,
  Eye,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { EducationalResource, Subject, ResourceCategory } from '@/types';
import { formatBytes, formatDate } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';

export default function DigitalLibraryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  useEffect(() => {
    setResources(AppStore.getResources());
    setSubjects(AppStore.getSubjects());
  }, []);

  const handleDownload = (res: EducationalResource) => {
    AppStore.incrementResourceDownloads(res.id);
    setResources(AppStore.getResources());
    setDownloadSuccessId(res.id);

    // Create a downloadable blob from extracted text if external file doesn't exist
    const blob = new Blob([res.extracted_text || res.title], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  const filteredResources = resources.filter((res) => {
    if (selectedSubject !== 'all' && res.subject_id !== selectedSubject) return false;
    if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchText = res.extracted_text?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchText) return false;
    }
    return true;
  });

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Resources' },
    { id: 'textbook', label: 'Textbooks' },
    { id: 'study_guide', label: 'Study Guides' },
    { id: 'worksheet', label: 'Worksheets' },
    { id: 'past_paper', label: 'Past Papers' },
    { id: 'revision_note', label: 'Revision Notes' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Educational Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Digital Secondary Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified CAPS textbooks, study guides, past examination papers, and revision documents.
          </p>
        </div>

        {/* Upload Action for Teachers/Admins */}
        {(user?.role === 'teacher' || user?.role === 'school_admin' || user?.role === 'platform_admin') && (
          <Link
            href="/teacher/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Upload New Material</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or chapter (e.g. Chemical Bonding, Algebra, DNA)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Learning Materials Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No authorized resources matched your current filter criteria. Try clearing your search query or selecting a different subject.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const subject = subjects.find((s) => s.id === res.subject_id);
            const isJustDownloaded = downloadSuccessId === res.id;

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {res.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatBytes(res.file_size_bytes)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug mb-2 line-clamp-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Metadata tags */}
                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-[11px] text-slate-500 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subject:</span>
                      <span className="font-semibold text-slate-800">
                        {subject?.name || 'CAPS Core'} ({subject?.code || ''})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pages / Format:</span>
                      <span className="text-slate-800 font-medium">
                        {res.pages_count} Pages • {res.file_type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Source:</span>
                      <span className="text-slate-800 truncate max-w-[170px]">
                        {res.uploaded_by_name || 'DBE Curriculum Committee'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/reader/${res.id}`}
                    className="flex-1 text-center py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open in Reader</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDownload(res)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isJustDownloaded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                    title="Download Resource"
                  >
                    {isJustDownloaded ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

