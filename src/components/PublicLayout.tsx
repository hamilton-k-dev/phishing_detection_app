import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#080c18' }}>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(8,12,24,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}>
            <i className="ri-shield-keyhole-fill text-white text-sm"></i>
          </div>
          <span className="text-white font-bold text-base tracking-tight">PhishGuard</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link
            href="/register"
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
          >
            Get Started
          </Link>
        </div>
      </header>
      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}
