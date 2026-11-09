'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  Check,
  AlertCircle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, Grade, ResourceCategory, FileType } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function TeacherUploadPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [gradeId, setGradeId] = useState('grade-10');
  const [category, setCategory] = useState<ResourceCategory>('textbook');
  const [copyright, setCopyright] = useState('Authorized CAPS Educational Material');
  const [fileContent, setFileContent] = useState('');
  const [pageCount, setPageCount] = useState<number>(3);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const allSubs = AppStore.getSubjects();
    setSubjects(allSubs);
    setGrades(AppStore.getGrades());
    if (allSubs.length > 0) {
      setSubjectId(allSubs[0].id);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    setIsSubmitting(true);

    AppStore.addResource({
      title: title.trim(),
      description: description.trim(),
      file_url: `/materials/${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`,
      storage_path: `materials/${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      file_size_bytes: Math.max(50000, fileContent.length * 12),
      file_type: 'pdf',
      category,
      grade_id: gradeId,
      subject_id: subjectId,
      school_id: user?.school_id || null,
      uploaded_by: user?.id || 'teacher-001',
      uploaded_by_name: user?.full_name || 'Assigned Subject Teacher',
      is_published: true,
      copyright_notice: copyright,
      permissions: 'public_to_grade',
      pages_count: pageCount,
      extracted_text:
        fileContent.trim() ||
        `PAGE 1: ${title.toUpperCase()}\n\n${description}\n\nPAGE 2: DETAILED CAPS SYLLABUS AND EXAMPLES\n\nContent for this newly uploaded curriculum resource.\n\nPAGE 3: EXAM PRACTICE QUESTIONS AND SUMMARY\n\nKey review questions for learners.`,
    });

    setSuccess(true);
    setTimeout(() => {
      router.push('/library');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Teacher Studio</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Digital Repository Ingestion</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Upload Educational Material
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish verified textbooks, study notes, past papers or worksheets for your students. Materials are automatically indexed for the document reader and AI tutor.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-emerald-900">Resource Published Successfully</h3>
            <p className="text-xs text-emerald-700">
              The material is now accessible to learners in the Digital Library and Document Reader.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resource Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grade 10 Physical Sciences: Chemical Systems Revision Guide"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Curriculum Objectives
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief summary of the topics and CAPS learning outcomes covered..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grade Level *
                </label>
                <select
                  value={gradeId}
                  onChange={(e) => setGradeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="textbook">Textbook Chapter</option>
                  <option value="study_guide">Study Guide</option>
                  <option value="worksheet">Worksheet</option>
                  <option value="past_paper">Past Exam Paper</option>
                  <option value="revision_note">Revision Note</option>
                  <option value="teacher_resource">Teacher Resource</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Educational Text (Extracted / OCR text for AI search)
              </label>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={6}
                placeholder="Paste the educational textbook text or notes here. You can separate pages using 'PAGE 1:', 'PAGE 2:', etc. This will be immediately readable in the Document Reader and indexed by the AI Study Assistant."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Copyright / Authorization Statement
              </label>
              <input
                type="text"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                placeholder="Approved CAPS Open Educational Resource"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
              >
                {isSubmitting ? 'Uploading & Indexing...' : 'Publish to Digital Library'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

