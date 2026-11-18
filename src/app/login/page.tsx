'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, LockKeyhole, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AppStore } from '@/lib/store/appStore';

const DEMO_EMAIL = 'learner@qrastudy.com';
const DEMO_PASSWORD = 'Password123';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const enteredEmail = email.trim().toLowerCase();
    if (!enteredEmail || !enteredEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (enteredEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError(`Use ${DEMO_EMAIL} and the demo password to sign in.`);
      return;
    }

    const demoUser = AppStore.switchRole('learner');
    demoUser.email = DEMO_EMAIL;
    setUser(demoUser);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#1b382b] text-white flex items-center justify-center shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to QraStudy</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in to continue to your learning dashboard</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-2">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#1b382b] hover:bg-[#244b3a] text-white py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <p className="font-bold mb-1">Demo Login</p>
            <p>Email: <span className="font-semibold">learner@qrastudy.com</span></p>
            <p>Password: <span className="font-semibold">Password123</span></p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/onboarding" className="font-bold text-[#246043] hover:underline">
              Create student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
