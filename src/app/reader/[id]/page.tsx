'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppStore } from '@/lib/store/appStore';
import { EducationalResource } from '@/types';
import { DocumentReader } from '@/components/reader/DocumentReader';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResourceReaderPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params?.id as string;
  const [resource, setResource] = useState<EducationalResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resourceId) {
      const found = AppStore.getResourceById(resourceId);
      if (found) {
        setResource(found);
      }
      setLoading(false);
    }
  }, [resourceId]);

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
        <h2 className="text-base font-bold text-slate-800">Resource Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The requested educational resource could not be found or has not been published yet.
        </p>
        <Link
          href="/library"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Digital Library</span>
        </Link>
      </div>
    );
  }

  return <DocumentReader resource={resource} />;
}

