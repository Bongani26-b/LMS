'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  BookOpen,
  PlaySquare,
  MessageSquare,
  Send,
  Loader2,
  Check,
  HelpCircle,
  Clock,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { EducationalResource, DocumentHighlight } from '@/types';
import { AppStore } from '@/lib/store/appStore';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CAPS_VIDEO_LESSONS } from '@/lib/data/videoLessons';

interface DocumentReaderProps {
  resource: EducationalResource;
}

export function DocumentReader({ resource }: DocumentReaderProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlights, setHighlights] = useState<DocumentHighlight[]>([]);

  // Selected text & anticipated questions
  const [activeSelection, setActiveSelection] = useState<string>('');
  const [anticipatedPrompts, setAnticipatedPrompts] = useState<string[]>([]);

  // AI Assistant state
  const [rightPanelTab, setRightPanelTab] = useState<'ai' | 'video' | 'highlights'>('ai');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiKeyTakeaways, setAiKeyTakeaways] = useState<string[]>([]);
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);

  const textContainerRef = useRef<HTMLDivElement>(null);

  // Parse pages from extracted text
  const pages = React.useMemo(() => {
    if (!resource.extracted_text) return ['Content loading...'];
    const parts = resource.extracted_text.split(/PAGE \d+:/i).map((p) => p.trim()).filter(Boolean);
    return parts.length > 0 ? parts : [resource.extracted_text];
  }, [resource.extracted_text]);

  const totalPages = pages.length;

  // Find linked video if available
  const linkedVideo = CAPS_VIDEO_LESSONS.find(
    (v) => v.linkedResourceId === resource.id || v.subjectName.toLowerCase().includes(resource.title.toLowerCase())
  ) || CAPS_VIDEO_LESSONS[0];

  useEffect(() => {
    if (user) {
      setHighlights(AppStore.getHighlights(user.id, resource.id));
      AppStore.incrementResourceViews(resource.id);
      AppStore.updateReadingProgress({
        learnerId: user.id,
        subjectId: resource.subject_id,
        resourceId: resource.id,
        page: currentPage,
        totalPages,
      });
    }
  }, [user, resource.id, resource.subject_id, totalPages, currentPage]);

  // When student clicks or highlights any text in the textbook:
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (text.length > 3) {
      handleDetectText(text);
    }
  };

  // Immediate detection of clicked/selected textbook concept
  const handleDetectText = (snippet: string) => {
    setActiveSelection(snippet);
    setRightPanelTab('ai');

    // Generate intelligent anticipated questions based on what student clicked!
    const lower = snippet.toLowerCase();
    const prompts: string[] = [];

    if (lower.includes('covalent') || lower.includes('bond') || lower.includes('sharing')) {
      prompts.push(
        'Can you explain what covalent bonding means in simple steps?',
        'Why do non-metals share electrons instead of transferring them?',
        'What is an example of a covalent bond question in CAPS exams?'
      );
    } else if (lower.includes('ionic') || lower.includes('lattice') || lower.includes('transfer')) {
      prompts.push(
        'Why do ionic compounds conduct electricity when dissolved in water?',
        'How does complete electron transfer create a crystal lattice?',
        'Can you break down the sodium chloride (NaCl) example?'
      );
    } else if (lower.includes('factor') || lower.includes('trinomial') || lower.includes('quadratic')) {
      prompts.push(
        'What is the simple rule to factorise this trinomial?',
        'How do I find the numbers that multiply to c and add to b?',
        'Can you show me a step-by-step worked example?'
      );
    } else if (lower.includes('photosynthesis') || lower.includes('chlorophyll') || lower.includes('glucose')) {
      prompts.push(
        'I don’t understand this. Can you explain photosynthesis in simple steps?',
        'Why is chlorophyll called the solar kitchen of the plant?',
        'How does the iodine starch test work in exams?'
      );
    } else if (lower.includes('dna') || lower.includes('replication') || lower.includes('protein')) {
      prompts.push(
        'Can you explain the steps of DNA replication simply?',
        'What is the difference between transcription and translation?',
        'Why does Adenine only pair with Thymine?'
      );
    } else {
      prompts.push(
        `What does "${snippet.slice(0, 45)}..." mean in simple terms?`,
        'Can you give a real-life analogy for this concept?',
        'What are the key points I should remember for tests?'
      );
    }

    setAnticipatedPrompts(prompts);
  };

  // Submit AI query
  const submitAIQuery = async (query: string, snippet?: string) => {
    setAiLoading(true);
    setAiResponse(null);

    const contextSnippet = snippet || activeSelection;

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          highlightedText: contextSnippet,
          subjectCode: resource.subject_id,
          gradeName: user?.grade_name,
          resourceTitle: resource.title,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setAiResponse(data.answer);
        setAiKeyTakeaways(data.keyTakeaways || []);
        setAiSuggestedQuestions(data.suggestedQuestions || []);

        if (user) {
          AppStore.recordAIInteraction({
            learner_id: user.id,
            subject_id: resource.subject_id,
            resource_id: resource.id,
            highlighted_text: contextSnippet,
            prompt: query,
            response: data.answer,
            model_used: data.modelName || 'Local Engine',
          });
        }
      }
    } catch {
      setAiResponse('Unable to communicate with the study assistant right now.');
    } finally {
      setAiLoading(false);
    }
  };

  const currentPageContent = pages[currentPage - 1] || 'No content for this page.';

  return (
    <div className="space-y-4">
      {/* 1. TOP READER NAVIGATION TOOLBAR */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Resource Title & Subject */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#e8f5ec] text-[#246043] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {resource.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary">CAPS Approved</Badge>
              <span className="text-[10px] text-slate-400 font-medium">
                Click any paragraph to ask the AI Tutor
              </span>
            </div>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-xs font-bold text-slate-700 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-mono font-bold text-slate-500 w-10 text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. MAIN SPLIT VIEW: TEXTBOOK (LEFT) + AI & VIDEO ASSISTANT (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
        {/* LEFT COLUMN: TEXTBOOK VIEWER (7 COLS) */}
        <div
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs overflow-y-auto"
          onMouseUp={handleTextSelection}
        >
          <div className="border-b border-slate-100 pb-3 mb-6 flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold text-slate-600">{resource.title}</span>
            <span className="font-bold">Page {currentPage}</span>
          </div>

          {/* Interactive Textbook Text */}
          <div
            ref={textContainerRef}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
            className="text-slate-800 text-sm sm:text-base leading-8 select-text whitespace-pre-wrap transition-transform"
          >
            {currentPageContent.split('\n\n').map((paragraph, pIdx) => (
              <p
                key={pIdx}
                onClick={() => handleDetectText(paragraph.trim())}
                className="mb-4 p-2 rounded-xl hover:bg-[#e8f5ec]/40 transition-colors cursor-pointer border border-transparent hover:border-[#d2ecd9]"
                title="Click to ask AI about this paragraph"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Click on any sentence or paragraph above to immediately trigger the AI assistant on the right.
          </div>
        </div>

        {/* RIGHT COLUMN: AI STUDY ASSISTANT & COMPANION VIDEOS (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            {/* Panel Tabs: AI Tutor / Companion Video */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setRightPanelTab('ai')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  rightPanelTab === 'ai'
                    ? 'bg-[#1b382b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>AI Study Assistant</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('video')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  rightPanelTab === 'video'
                    ? 'bg-[#1b382b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <PlaySquare className="w-3.5 h-3.5" />
                <span>Video Lesson</span>
              </button>
            </div>

            {/* TAB A: AI ASSISTANT CLOSE TO TEXTBOOK */}
            {rightPanelTab === 'ai' && (
              <div className="space-y-4">
                {/* Detected / Clicked Textbook Section Banner */}
                {activeSelection ? (
                  <div className="p-3.5 rounded-2xl bg-[#e8f5ec] border border-[#d2ecd9] text-xs space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#246043] uppercase tracking-wider">
                      <span>Detected from Textbook:</span>
                      <button
                        type="button"
                        onClick={() => setActiveSelection('')}
                        className="text-slate-500 hover:text-slate-800"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="font-semibold text-slate-800 line-clamp-3 italic">
                      &quot;{activeSelection}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#246043] shrink-0" />
                    <span>Click any concept in the textbook on the left to detect it.</span>
                  </div>
                )}

                {/* Anticipated Student Questions (What the AI knows the student will ask) */}
                {anticipatedPrompts.length > 0 && !aiLoading && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Anticipated Questions:
                    </span>
                    {anticipatedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiPrompt(p);
                          submitAIQuery(p);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-[#e8f5ec] border border-slate-200/80 hover:border-[#246043] text-xs font-semibold text-slate-700 transition-colors flex items-center justify-between group"
                      >
                        <span className="group-hover:text-[#246043]">{p}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#246043] shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                )}

                {/* AI Response Display Area */}
                <div className="max-h-[340px] overflow-y-auto pr-1 space-y-3">
                  {aiLoading ? (
                    <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#246043] mx-auto" />
                      <p className="font-bold text-slate-700">Explaining textbook concept...</p>
                      <p className="text-[11px]">Grounded in South African CAPS curriculum.</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-medium">
                        {aiResponse}
                      </div>

                      {aiKeyTakeaways.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-[#e8f5ec] border border-[#d2ecd9] text-xs text-[#246043]">
                          <span className="font-bold block mb-1">Key Exam Takeaways:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {aiKeyTakeaways.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* TAB B: COMPANION VIDEO LESSON */}
            {rightPanelTab === 'video' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
                  <iframe
                    src={linkedVideo.videoUrl}
                    title={linkedVideo.title}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{linkedVideo.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{linkedVideo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <div className="pt-3 border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (aiPrompt.trim()) {
                  submitAIQuery(aiPrompt);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={
                  activeSelection
                    ? 'Ask about selected textbook text...'
                    : 'Ask anything about this chapter...'
                }
                className="flex-1 px-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#246043]"
              />
              <Button type="submit" size="sm" disabled={aiLoading || !aiPrompt.trim()}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
