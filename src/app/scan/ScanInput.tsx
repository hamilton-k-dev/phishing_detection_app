'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const tips = [
  { icon: 'ri-shield-keyhole-line', title: 'SSL Verification', desc: 'We check if the site has a valid SSL certificate and proper HTTPS configuration.' },
  { icon: 'ri-time-line', title: 'Domain Age Analysis', desc: 'Newly registered domains are often used for phishing. We detect suspicious domain patterns.' },
  { icon: 'ri-link-m', title: 'URL Pattern Check', desc: 'Suspicious URL structures, excessive subdomains, and misleading keywords are detected.' },
];

const STAGES = [
  'Resolving domain...',
  'Checking SSL certificate...',
  'Analyzing URL structure...',
  'Scanning for keywords...',
  'Checking domain reputation...',
  'Calculating risk score...',
];

export default function ScanInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleScan = async () => {
    if (!url.trim()) return;
    setError('');

    const normalized = url.trim().startsWith('http') ? url.trim() : 'https://' + url.trim();
    try {
      const { hostname } = new URL(normalized);
      const validHost = hostname === 'localhost' || /\.[a-z]{2,}$/i.test(hostname);
      if (!validHost) throw new Error();
    } catch {
      setError('Please enter a valid URL — e.g. https://example.com');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStage(STAGES[0]);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      const next = Math.min(step * 14, 88);
      setProgress(next);
      setStage(STAGES[Math.min(step, STAGES.length - 1)]);
    }, 700);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      stopInterval();

      if (res.ok) {
        const { id } = await res.json();
        setProgress(100);
        setStage('Analysis complete!');
        setTimeout(() => router.push(`/result/${id}`), 400);
      } else {
        const { error: msg } = await res.json().catch(() => ({ error: 'Scan failed' }));
        setError(msg ?? 'Scan failed. Please try again.');
        setLoading(false);
      }
    } catch {
      stopInterval();
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">URL Security Scanner</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-3 mb-3">Analyze Website Safety</h1>
          <p className="text-slate-400 text-sm sm:text-base">Enter any URL to instantly check for phishing threats, malware, and suspicious activity.</p>
        </div>

        {!loading ? (
          <div className="space-y-3">
            <div
              className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-3 transition-all"
              style={{ background: '#0d1224', border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(0,212,255,0.2)'}` }}
            >
              <div className="w-6 h-6 flex items-center justify-center text-cyan-400 shrink-0">
                <i className="ri-search-eye-line text-xl"></i>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="https://example.com"
                className="flex-1 min-w-0 bg-transparent text-white placeholder-slate-500 outline-none text-sm sm:text-base"
              />
              <button
                onClick={handleScan}
                className="px-3 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm text-white whitespace-nowrap cursor-pointer transition-all hover:opacity-90 shrink-0"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
              >
                <span className="hidden sm:inline">Analyze Website</span>
                <span className="sm:hidden">Scan</span>
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400 px-1">{error}</p>
            )}
            <p className="text-xs text-slate-500 text-center">Supports HTTP, HTTPS, and bare domain names. Real heuristic analysis — not a demo.</p>
          </div>
        ) : (
          <div
            className="rounded-xl p-6 sm:p-8 text-center"
            style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6">
              <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke="url(#scanGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <defs>
                  <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-cyan-400">{progress}%</span>
              </div>
            </div>
            <p className="text-white font-semibold text-lg mb-1">Scanning in progress...</p>
            <p className="text-cyan-400 text-sm animate-pulse">{stage}</p>
            <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00d4ff, #0066ff)' }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-10">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl p-4"
              style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.08)' }}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg mb-3" style={{ background: 'rgba(0,212,255,0.1)' }}>
                <i className={`${tip.icon} text-lg text-cyan-400`}></i>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{tip.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
