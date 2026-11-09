'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PlaySquare,
  Play,
  Clock,
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CAPS_VIDEO_LESSONS, VideoLesson } from '@/lib/data/videoLessons';

export default function VideoLessonsPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(CAPS_VIDEO_LESSONS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = CAPS_VIDEO_LESSONS.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ec] text-[#246043] text-xs font-bold mb-1.5">
            <PlaySquare className="w-3.5 h-3.5" />
            <span>Curriculum Video Library</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            CAPS Video Lessons & Explanations
          </h1>
          <p className="text-xs text-slate-500">
            Watch certified educator lessons alongside your textbooks and consult the AI study assistant anytime.
          </p>
        </div>
      </div>

      {/* Main Video Player & Watch Section */}
      {selectedVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Viewport */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedVideo.grade}</Badge>
                <Badge variant="outline">{selectedVideo.subjectName}</Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedVideo.duration}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">{selectedVideo.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedVideo.description}</p>
            </div>

            {/* Quick Actions: Open Linked Textbook or Ask AI */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {selectedVideo.linkedResourceId && (
                <Link href={`/reader/${selectedVideo.linkedResourceId}`}>
                  <Button variant="default" size="sm">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Companion Textbook</span>
                  </Button>
                </Link>
              )}

              <Link href={`/ai-tutor?prompt=${encodeURIComponent(`Explain key concepts from: ${selectedVideo.title}`)}`}>
                <Button variant="secondary" size="sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI about this Lesson</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Video Playlist */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">
                Curriculum Lessons ({filtered.length})
              </h3>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filtered.map((video) => {
                  const isCurrent = selectedVideo.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isCurrent
                          ? 'border-[#246043] bg-[#e8f5ec]/50 ring-1 ring-[#246043]'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#1b382b] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Play className="w-4 h-4 fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span>{video.grade}</span>
                          <span>•</span>
                          <span>{video.subjectName}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                DBE Aligned Secondary Video Catalog
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
