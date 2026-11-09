'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppStore } from '@/lib/store/appStore';
import { EducationalResource } from '@/types';
import { DocumentReader } from '@/components/reader/DocumentReader';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function ReaderContent() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get('subject');
  const [resource, setResource] = useState<EducationalResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = AppStore.getResources();
    if (subjectFilter) {
      const match = all.find((r) => r.subject_id === subjectFilter);
      setResource(match || all[0] || null);
    } else {
      setResource(all[0] || null);
    }
    setLoading(false);
  }, [subjectFilter]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-base font-bold text-slate-800">No Learning Materials in Library</h2>
        <p className="text-xs text-slate-500 mt-2">
          Your school library has not yet uploaded any textbooks.
        </p>
        <Link
          href="/library"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Go to Library
        </Link>
      </div>
    );
  }

  return <DocumentReader resource={resource} />;
}

export default function ReaderIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ReaderContent />
    </Suspense>
  );
}
