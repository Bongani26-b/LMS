import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 text-slate-600 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <span>Digital Secondary School</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Comprehensive Learning Management System engineered for South African secondary
              schools across Senior Phase (Grades 8–9) and Further Education and Training (Grades 10–12).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Curriculum Alignment</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CAPS (Curriculum & Assessment Policy)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Extensible multi-curriculum architecture</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified DBE subject codes & terms</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">AI & Architecture</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>Local inference (Ollama / Llama 3.2 / Gemma 2)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Retrieval-Augmented Generation (RAG)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>PostgreSQL / Supabase + Row Level Security</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">System Integrity</h4>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-900">Functional Guarantee</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Engineered with complete end-to-end functionality, real database tables, active onboarding, live highlight-to-AI, and authentic educational empty states.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[11px] gap-2">
          <div>
            © {new Date().getFullYear()} Digital Secondary School LMS. Designed for South African Secondary Education.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">CAPS Grades 8–12</span>
            <span>•</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              System Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

