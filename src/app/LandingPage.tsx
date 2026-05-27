import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import LandingScanner from './LandingScanner';

interface Props {
  stats: { total: number; phishing: number; safe: number };
}

const features = [
  { icon: 'ri-shield-check-line', color: '#00d4ff', title: 'Real-time Analysis', desc: 'Instant heuristic scan checking SSL, domain age, URL structure, and phishing keywords.' },
  { icon: 'ri-history-line', color: '#22c55e', title: 'Scan History', desc: 'Sign in to save every scan, revisit past results, and track threats over time.' },
  { icon: 'ri-bar-chart-2-line', color: '#a855f7', title: 'Risk Scoring', desc: 'Clear 0–100 risk score with a per-factor breakdown — know exactly what triggered the alert.' },
  { icon: 'ri-global-line', color: '#eab308', title: 'No Account Needed', desc: 'Scan any URL instantly. Create a free account only when you want to save your history.' },
];

const steps = [
  { n: '01', title: 'Paste a URL', desc: 'Drop any link into the scanner above — http, https, or bare domain.' },
  { n: '02', title: 'We analyse it', desc: 'PhishGuard checks SSL, domain reputation, keywords, URL structure, and more.' },
  { n: '03', title: 'Get your verdict', desc: 'See a full breakdown with a 0–100 risk score in under 3 seconds.' },
];

export default function LandingPage({ stats }: Props) {
  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-24 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, #0066ff 60%, transparent 100%)' }}
        />

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-cyan-400 mb-6"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <i className="ri-shield-keyhole-fill"></i>
          Free · No account required
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-5">
          Is that link<br />
          <span style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            safe to click?
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
          Paste any suspicious URL and PhishGuard scans it in seconds — checking phishing indicators, malicious keywords, domain reputation, and more.
        </p>

        <LandingScanner />

        {/* Live stats */}
        {stats.total > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-slate-500">
            <span><strong className="text-white">{stats.total.toLocaleString()}</strong> URLs scanned</span>
            <span className="hidden sm:block w-px h-4 bg-slate-700"></span>
            <span><strong className="text-red-400">{stats.phishing.toLocaleString()}</strong> threats caught</span>
            <span className="hidden sm:block w-px h-4 bg-slate-700"></span>
            <span><strong className="text-green-400">{stats.safe.toLocaleString()}</strong> safe sites confirmed</span>
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-white mb-12">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map(s => (
            <div key={s.n} className="flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 font-black text-lg"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.15))', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
              >
                {s.n}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-white mb-10">What we check</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="rounded-xl p-5" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}18` }}>
                <i className={`${f.icon} text-xl`} style={{ color: f.color }}></i>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24 text-center">
        <div
          className="max-w-lg mx-auto rounded-2xl px-8 py-10"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,102,255,0.08))', border: '1px solid rgba(0,212,255,0.15)' }}
        >
          <i className="ri-shield-star-line text-4xl text-cyan-400 block mb-4"></i>
          <h3 className="text-xl font-bold text-white mb-2">Save your scan history</h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Create a free account to access analytics, track threats over time, and review all past scans from your personal dashboard.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
            >
              <i className="ri-user-add-line"></i>
              Create free account
            </Link>
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Already have one? Sign in →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
