'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { signUp } from '@/lib/auth-client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp.email({ name, email, password, callbackURL: '/' });
      if (error) {
        toast.error(error.message ?? 'Registration failed');
      } else {
        toast.success('Account created! Redirecting…');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-xl font-bold text-white">Create account</h1>
            <p className="text-sm text-slate-500 mt-1">Start protecting yourself from phishing threats</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="ri-user-line text-sm"></i>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  autoComplete="name"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                />
              </div>
            </div>

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
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="ri-lock-line text-sm"></i>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
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

            {/* Confirm password */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Confirm password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="ri-lock-2-line text-sm"></i>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <i className="ri-user-add-line"></i>
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: 'ri-history-line', label: 'Scan history' },
            { icon: 'ri-bar-chart-2-line', label: 'Analytics' },
            { icon: 'ri-shield-check-line', label: 'Free forever' },
          ].map(b => (
            <div key={b.label} className="rounded-xl py-3 px-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.08)' }}>
              <i className={`${b.icon} text-cyan-400 text-lg block mb-1`}></i>
              <span className="text-xs text-slate-500">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
