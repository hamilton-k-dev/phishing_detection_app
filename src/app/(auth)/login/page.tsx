'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const { error } = await signIn.email({ email, password, callbackURL: callbackUrl });
      if (error) {
        toast.error(error.message ?? 'Invalid credentials');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail('demo@phishguard.com');
    setPassword('demo1234');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#080c18' }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-175 h-100 opacity-[0.06] blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #00d4ff 0%, #0066ff 60%, transparent 100%)' }} />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}>
            <i className="ri-shield-keyhole-fill text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">PhishGuard</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl p-8 space-y-6" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.15)' }}>
          <div>
            <h1 className="text-xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your security dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="ri-mail-line text-sm"></i>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">Password</label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="ri-lock-line text-sm"></i>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <i className={showPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Demo hint */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full rounded-lg px-3 py-2.5 flex items-start gap-2.5 text-left transition-all hover:border-cyan-500/30 cursor-pointer"
            style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}
          >
            <i className="ri-information-line text-sm text-cyan-400 mt-0.5 shrink-0"></i>
            <div>
              <p className="text-xs text-cyan-300 font-medium">Try the demo account</p>
              <p className="text-xs text-slate-500 mt-0.5">Click to fill: demo@phishguard.com / demo1234</p>
            </div>
          </button>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
