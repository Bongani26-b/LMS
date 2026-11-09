'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Highlighter,
  Sparkles,
  BookOpen,
  Search,
  Bookmark,
  Share2,
  X,
  MessageSquare,
  Send,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EducationalResource, DocumentHighlight, AIStudyInteraction } from '@/types';
import { AppStore } from '@/lib/store/appStore';
import { useAuth } from '@/components/auth/AuthContext';

interface DocumentReaderProps {
  resource: EducationalResource;
}

export function DocumentReader({ resource }: DocumentReaderProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlights, setHighlights] = useState<DocumentHighlight[]>([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  // AI Assistant Sidebar state
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiActiveSelection, setAiActiveSelection] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiKeyTakeaways, setAiKeyTakeaways] = useState<string[]>([]);
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);

  // Search inside document
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ai' | 'highlights' | 'search'>('ai');

  const textContainerRef = useRef<HTMLDivElement>(null);

  // Parse pages from extracted text
  const pages = React.useMemo(() => {
    if (!resource.extracted_text) return ['Content loading...'];
    const parts = resource.extracted_text.split(/PAGE \d+:/i).map((p) => p.trim()).filter(Boolean);
    return parts.length > 0 ? parts : [resource.extracted_text];
  }, [resource.extracted_text]);

  const totalPages = pages.length;

  // Load highlights & track reading progress
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

  // Handle text selection in document
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setContextMenuPos(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setContextMenuPos({
        x: Math.max(10, rect.left + rect.width / 2 - 80),
        y: Math.max(10, rect.top - 50),
      });
    }
  };

  // Add highlight to text
  const handleAddHighlight = (color: 'yellow' | 'green' | 'blue' | 'purple') => {
    if (!user || !selectedText) return;

    const newHl = AppStore.addHighlight({
      learner_id: user.id,
      resource_id: resource.id,
      page_number: currentPage,
      selected_text: selectedText,
      color,
    });

    setHighlights((prev) => [...prev, newHl]);
    setContextMenuPos(null);
    window.getSelection()?.removeAllRanges();
  };

  // Trigger Ask AI from selection
  const handleAskAI = (presetQuestion?: string) => {
    const targetText = selectedText || aiActiveSelection;
    setAiActiveSelection(targetText);
    setAiPanelOpen(true);
    setActiveTab('ai');
    setContextMenuPos(null);

    const question = presetQuestion || aiPrompt || 'Can you explain what this means in simple steps?';
    setAiPrompt(question);
    submitAIQuery(question, targetText);
  };

  const submitAIQuery = async (query: string, snippet?: string) => {
    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          highlightedText: snippet || aiActiveSelection,
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
            highlighted_text: snippet || aiActiveSelection,
            prompt: query,
            response: data.answer,
            model_used: data.modelName || 'Local Engine',
          });
        }
      } else {
        setAiResponse('Unable to generate explanation. Please try again.');
      }
    } catch {
      setAiResponse('Educational assistant is temporarily unavailable. Please check your connection.');
    } finally {
      setAiLoading(false);
    }
  };

  // Content for current page
  const currentPageContent = pages[currentPage - 1] || 'No content for this page.';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden relative">
      {/* 1. TOP READER CONTROL TOOLBAR */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between z-20 shadow-xs">
        {/* Left: Resource Info */}
        <div className="flex items-center gap-3 truncate max-w-sm sm:max-w-md">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {resource.title}
            </h2>
            <p className="text-[10px] text-slate-400 truncate">
              CAPS Verified • {resource.category.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-xs font-semibold text-slate-700 px-2">
            <span>Page </span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                  setCurrentPage(val);
                }
              }}
              className="w-10 text-center py-0.5 border border-slate-200 rounded font-bold text-slate-900"
            />
            <span className="text-slate-400"> of {totalPages}</span>
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom & AI Drawer Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 border-r border-slate-200 pr-2">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle AI Panel Button */}
          <button
            type="button"
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              aiPanelOpen
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Study Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN READING CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center"
          onMouseUp={handleMouseUp}
        >
          {/* Paper sheet */}
          <div
            ref={textContainerRef}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-3xl bg-white shadow-md border border-slate-200 rounded-xl p-8 sm:p-14 min-h-[750px] transition-transform duration-200 text-slate-800 leading-relaxed font-serif"
          >
            {/* Header in page */}
            <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-center text-xs text-slate-400 font-sans">
              <span>{resource.title}</span>
              <span>Page {currentPage}</span>
            </div>

            {/* Page content with selection capability */}
            <div className="space-y-4 text-base text-slate-900 select-text whitespace-pre-wrap leading-8">
              {currentPageContent}
            </div>

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-sans">
              Approved Secondary Educational Material • South African CAPS Framework
            </div>
          </div>

          {/* Floating Contextual Highlight-to-AI Action Bar */}
          {contextMenuPos && selectedText && (
            <div
              style={{
                top: `${contextMenuPos.y}px`,
                left: `${contextMenuPos.x}px`,
                position: 'fixed',
              }}
              className="z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-1.5 flex items-center gap-1.5 animate-in fade-in zoom-in-95 text-xs font-sans"
            >
              {/* Highlight color buttons */}
              <button
                type="button"
                onClick={() => handleAddHighlight('yellow')}
                className="w-6 h-6 rounded-md bg-yellow-300 hover:scale-110 transition-transform"
                title="Highlight Yellow"
              />
              <button
                type="button"
                onClick={() => handleAddHighlight('green')}
                className="w-6 h-6 rounded-md bg-emerald-400 hover:scale-110 transition-transform"
                title="Highlight Green"
              />
              <button
                type="button"
                onClick={() => handleAddHighlight('purple')}
                className="w-6 h-6 rounded-md bg-purple-400 hover:scale-110 transition-transform"
                title="Highlight Purple"
              />

              <div className="w-px h-4 bg-slate-700 mx-1" />

              {/* The Key Requirement: Ask AI Contextual Action */}
              <button
                type="button"
                onClick={() => handleAskAI('Explain this highlighted text simply')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Ask AI</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. INTEGRATED AI STUDY ASSISTANT SIDEBAR / DRAWER */}
        {aiPanelOpen && (
          <aside className="w-full sm:w-96 md:w-[420px] bg-white border-l border-slate-200 flex flex-col h-full z-30 shadow-xl animate-in slide-in-from-right duration-200">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Learning Assistant</h3>
                  <p className="text-[10px] text-purple-700 font-medium">
                    Grounded in CAPS Educational Standards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiPanelOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-2.5 text-center font-semibold transition-colors ${
                  activeTab === 'ai'
                    ? 'border-b-2 border-purple-600 text-purple-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('highlights')}
                className={`flex-1 py-2.5 text-center font-semibold transition-colors ${
                  activeTab === 'highlights'
                    ? 'border-b-2 border-purple-600 text-purple-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Highlights ({highlights.length})
              </button>
            </div>

            {/* Tab: AI Tutor */}
            {activeTab === 'ai' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Highlighted text preview banner if available */}
                  {aiActiveSelection && (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-purple-800 mb-1 uppercase tracking-wider">
                        <span>Highlighted Passage:</span>
                        <button
                          type="button"
                          onClick={() => setAiActiveSelection('')}
                          className="hover:text-purple-950"
                        >
                          Clear
                        </button>
                      </div>
                      <p className="italic text-slate-700 line-clamp-3">
                        &quot;{aiActiveSelection}&quot;
                      </p>
                    </div>
                  )}

                  {/* AI Response Area */}
                  {aiLoading ? (
                    <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
                      <p className="font-semibold text-slate-700">
                        Analyzing curriculum context...
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Grounding explanation in CAPS Grade 8–12 approved textbooks.
                      </p>
                    </div>
                  ) : aiResponse ? (
                    <div className="space-y-4">
                      {/* Formatted Answer */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                        {aiResponse}
                      </div>

                      {/* Key Takeaways */}
                      {aiKeyTakeaways.length > 0 && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <h4 className="text-[11px] font-bold text-emerald-900 mb-1.5 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Key Exam Takeaways</span>
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-800">
                            {aiKeyTakeaways.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Suggested Questions */}
                      {aiSuggestedQuestions.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Suggested Follow-up Questions:
                          </span>
                          {aiSuggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setAiPrompt(q);
                                submitAIQuery(q);
                              }}
                              className="w-full text-left p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors flex items-center justify-between"
                            >
                              <span>{q}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs space-y-3">
                      <HelpCircle className="w-8 h-8 text-purple-300 mx-auto" />
                      <p className="font-semibold text-slate-700">
                        Select text in the reader to ask questions!
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Highlight any sentence in the textbook and click{' '}
                        <strong>&quot;Ask AI&quot;</strong>, or type your subject question below.
                      </p>

                      <div className="pt-2 flex flex-col gap-1.5 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            const q = 'Can you explain the main concept on this page simply?';
                            setAiPrompt(q);
                            submitAIQuery(q);
                          }}
                          className="p-2 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-medium hover:bg-purple-100 transition-colors"
                        >
                          💡 &quot;Explain the main concept on this page simply&quot;
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const q = 'What are common exam questions for this topic?';
                            setAiPrompt(q);
                            submitAIQuery(q);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium hover:bg-blue-100 transition-colors"
                        >
                          📝 &quot;What are common exam questions for this topic?&quot;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-slate-200 bg-white">
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
                        aiActiveSelection
                          ? 'Ask about highlighted text...'
                          : 'Ask anything about this chapter...'
                      }
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:opacity-40 transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab: Highlights */}
            {activeTab === 'highlights' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {highlights.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No highlights saved yet. Highlight any phrase in the reader to bookmark it for revision.
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div
                      key={hl.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Page {hl.page_number}</span>
                        <button
                          type="button"
                          onClick={() => {
                            AppStore.removeHighlight(hl.id);
                            if (user) {
                              setHighlights(AppStore.getHighlights(user.id, resource.id));
                            }
                          }}
                          className="hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="font-serif italic text-slate-800 line-clamp-3">
                        &quot;{hl.selected_text}&quot;
                      </p>
                      <div className="pt-1 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setAiActiveSelection(hl.selected_text);
                            setActiveTab('ai');
                            handleAskAI('Can you explain this highlight?');
                          }}
                          className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Ask AI</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

