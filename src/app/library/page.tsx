'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  Check,
  PlaySquare,
  Sparkles,
  Filter,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { EducationalResource, Subject } from '@/types';
import { formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function DigitalLibraryPage() {
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
    }, 2000);
  };

  const categories = [
    { id: 'all', label: 'All Materials' },
    { id: 'textbook', label: 'Textbooks' },
    { id: 'study_guide', label: 'Study Guides' },
    { id: 'worksheet', label: 'Worksheets' },
    { id: 'past_paper', label: 'Past Papers' },
  ];

  const filtered = resources.filter((res) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ec] text-[#246043] text-xs font-bold mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Textbooks & Materials</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Digital Educational Library
          </h1>
          <p className="text-xs text-slate-500">
            Approved CAPS textbooks and study notes with integrated highlight-to-AI reading and video lessons.
          </p>
        </div>

        <Link href="/videos">
          <Button variant="secondary" size="sm">
            <PlaySquare className="w-3.5 h-3.5" />
            <span>Browse Video Lessons</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, chapter, or keyword (e.g. Chemical Bonding, Algebra, Photosynthesis)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#246043]"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#246043] bg-white font-medium"
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
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Category:</span>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#1b382b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => {
          const subject = subjects.find((s) => s.id === res.subject_id);
          const isDownloaded = downloadSuccessId === res.id;

          return (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">
                    {res.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatBytes(res.file_size_bytes)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-2 line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {res.description}
                </p>

                <div className="space-y-1.5 py-3 border-y border-slate-100 text-[11px] text-slate-500 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject:</span>
                    <span className="font-bold text-slate-800">
                      {subject?.name || 'CAPS Core'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pages:</span>
                    <span className="text-slate-800 font-medium">
                      {res.pages_count} Pages (Interactive)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Features:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Highlight-to-AI Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Open in Reader with AI or Download */}
              <div className="pt-2 flex items-center gap-2">
                <Link href={`/reader/${res.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Read with AI Tutor</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(res)}
                  title="Download File"
                >
                  {isDownloaded ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
