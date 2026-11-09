'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
  Server,
  Database,
  Radio,
} from 'lucide-react';
import { AppStore } from '@/lib/store/appStore';
import { AISettings } from '@/types';

export default function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>(AppStore.getAISettings());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ status: string; connected: boolean } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.updateAISettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const testOllama = async () => {
    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai/health');
      const data = await res.json();
      setTestResult({
        status: data.status,
        connected: data.ollama?.connected,
      });
    } catch {
      setTestResult({
        status: 'error',
        connected: false,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/platform-admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Platform Governance</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Architecture & Model Routing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            AI Inference & Model Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure local inference (Ollama), specify open-weight models, and manage Retrieval-Augmented Generation (RAG) vector grounding across secondary school materials.
          </p>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>AI Configuration saved and applied across all learning panels.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Select Active Inference Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'ollama',
                  title: 'Ollama Local Host',
                  desc: 'Zero-cost local model inference (Llama 3.2, Mistral, Gemma 2)',
                },
                {
                  id: 'openai_compatible',
                  title: 'OpenAI Compatible',
                  desc: 'Connect to external open endpoint or compatible API host',
                },
                {
                  id: 'local_fallback',
                  title: 'Built-in Educational Engine',
                  desc: 'Guaranteed 0% downtime CAPS secondary explanation system',
                },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() =>
                    setSettings({ ...settings, provider: p.id as AISettings['provider'] })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    settings.provider === p.id
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">{p.title}</span>
                  <p className="text-[11px] text-slate-500 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ollama Settings */}
          {settings.provider === 'ollama' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600" />
                Ollama Endpoint & Model Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Ollama Base URL
                  </label>
                  <input
                    type="text"
                    value={settings.ollama_base_url}
                    onChange={(e) =>
                      setSettings({ ...settings, ollama_base_url: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default: http://localhost:11434</p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Model Identifier (Configurable)
                  </label>
                  <input
                    type="text"
                    value={settings.ollama_model}
                    onChange={(e) =>
                      setSettings({ ...settings, ollama_model: e.target.value })
                    }
                    placeholder="e.g. llama3.2, mistral, gemma2:9b"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Run `ollama run llama3.2` on host machine
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={testOllama}
                  disabled={testingConnection}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {testingConnection ? 'Checking Endpoint...' : 'Test Ollama Connection'}
                </button>

                {testResult && (
                  <span
                    className={`text-xs font-semibold ${
                      testResult.connected ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {testResult.connected
                      ? '✓ Ollama service is active and responding!'
                      : '⚠ Ollama service not detected on host. The built-in CAPS educational engine will handle requests seamlessly.'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* RAG & Temperature Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Temperature ({settings.temperature})
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.temperature}
                onChange={(e) =>
                  setSettings({ ...settings, temperature: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Lower values (0.2 - 0.4) provide more factual, grounded pedagogical responses.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Retrieval-Augmented Generation (RAG) Grounding
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="rag_enabled"
                  checked={settings.rag_enabled}
                  onChange={(e) => setSettings({ ...settings, rag_enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="rag_enabled" className="text-xs font-medium text-slate-700">
                  Retrieve textbook passages for all student queries
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Save AI Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

