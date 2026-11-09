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
          text: 'The AI learning assistant could not be reached. Ensure Ollama is running or verify network status.',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curriculum Grounded AI Tutor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Study Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ask questions, clarify textbook concepts, and receive structured, step-by-step CAPS explanations.
          </p>
        </div>

        {/* Subject Picker */}
        <div className="w-full sm:w-64">
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
            Focus Subject:
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Bot className="w-7 h-7" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full text-left pt-2">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(sp)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-xs text-slate-700 transition-colors flex items-center justify-between"
                  >
                    <span>{sp}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0 ml-1" />
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
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Key Takeaways */}
                  {msg.takeaways && msg.takeaways.length > 0 && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                      <span className="font-bold block mb-1">Key Syllabus Takeaways:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {msg.takeaways.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Follow-up suggestions:
                      </span>
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(sq)}
                          className="text-[11px] text-purple-700 hover:text-purple-900 block font-medium underline"
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
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>Searching curriculum documents and preparing step-by-step explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
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
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 shadow-xs shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AITutorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <AITutorContent />
    </Suspense>
  );
}
