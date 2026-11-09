'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Send,
  Loader2,
  BookOpen,
  Check,
  Bot,
  User as UserIcon,
  HelpCircle,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { Subject, AIStudyInteraction } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function AITutorContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      sender: 'user' | 'ai';
      text: string;
      takeaways?: string[];
      suggestedQuestions?: string[];
      modelName?: string;
    }>
  >([]);

  useEffect(() => {
    const all = AppStore.getSubjects();
    setSubjects(all);
    if (subjectParam && all.some((s) => s.id === subjectParam)) {
      setSelectedSubjectId(subjectParam);
    } else if (all.length > 0) {
      setSelectedSubjectId(all[0].id);
    }
  }, [subjectParam]);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleSend = async (customText?: string) => {
    const queryText = customText || prompt;
    if (!queryText.trim() || loading) return;

    // Add user message to history
    setChatHistory((prev) => [...prev, { sender: 'user', text: queryText }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          subjectCode: activeSubject?.code || activeSubject?.id,
          subjectName: activeSubject?.name,
          gradeName: user?.grade_name || 'Grade 10',
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer,
            takeaways: data.keyTakeaways,
            suggestedQuestions: data.suggestedQuestions,
            modelName: data.modelName,
          },
        ]);

        if (user && activeSubject) {
          AppStore.recordAIInteraction({
            learner_id: user.id,
            subject_id: activeSubject.id,
            prompt: queryText,
            response: data.answer,
            model_used: data.modelName || 'Local Inference',
          });
        }
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'The AI study assistant could not be reached. Please verify your connection or local inference server.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I distinguish between ionic and covalent bonding?',
    'Explain the steps of DNA replication in simple terms.',
    'What is the method to factorise quadratic trinomials?',
    'What are the key definitions I must memorize for the upcoming test?',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8f5ec] text-[#1b382b] rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#246043]" />
            <span>Curriculum Grounded AI Tutor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI Study Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Ask questions, clarify textbook concepts, and receive structured, step-by-step CAPS explanations.
          </p>
        </div>

        {/* Subject Focus Selector */}
        <div className="w-full sm:w-64">
          <label className="text-[11px] font-bold text-slate-600 block mb-1">
            Focus Subject:
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b382b] font-semibold text-slate-800"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Container */}
      <Card className="flex flex-col h-[650px] overflow-hidden border-slate-100 shadow-xs">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#e8f5ec] text-[#1b382b] flex items-center justify-center">
                <Bot className="w-8 h-8 text-[#246043]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Ready to assist with {activeSubject?.name || 'Secondary Education'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  This assistant is grounded in approved South African CAPS curriculum materials. Try asking one of these questions to start:
                </p>
              </div>

              {/* Sample prompts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full text-left pt-2">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(sp)}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-[#f8faf9] hover:border-[#1b382b] hover:bg-white text-xs text-slate-700 font-medium transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span>{sp}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#246043] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-[#1b382b] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-3xl p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1b382b] text-white font-medium shadow-xs'
                      : 'bg-[#f1f5f2] border border-slate-200/60 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Key Takeaways */}
                  {msg.takeaways && msg.takeaways.length > 0 && (
                    <div className="mt-4 p-4 bg-[#e8f5ec] rounded-2xl border border-emerald-200/80 text-emerald-950 text-xs">
                      <span className="font-bold block mb-1.5 text-[#1b382b]">Key Syllabus Takeaways:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {msg.takeaways.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Anticipated Follow-Up Questions:
                      </span>
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(sq)}
                          className="text-[11px] text-[#246043] hover:text-[#1b382b] block font-semibold hover:underline"
                        >
                          → {sq}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.modelName && (
                    <div className="mt-2 text-[10px] text-slate-400 text-right">
                      Source: {msg.modelName}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 bg-[#f1f5f2] p-4 rounded-2xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-[#1b382b]" />
              <span>Consulting CAPS curriculum materials and formulating answer...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Ask a question about ${activeSubject?.name || 'this subject'}...`}
              className="flex-1 px-5 py-3 text-xs sm:text-sm rounded-full border border-slate-200 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-[#1b382b] focus:bg-white transition-colors"
            />
            <Button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="rounded-full bg-[#1b382b] hover:bg-[#142a20] text-white text-xs font-bold px-6 h-11 gap-1.5 shadow-xs shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function AITutorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1b382b]" />
        </div>
      }
    >
      <AITutorContent />
    </Suspense>
  );
}
