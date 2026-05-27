'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingScanner() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function handleScan() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setError('');

    const normalized = trimmed.startsWith('http') ? trimmed : 'https://' + trimmed;
    try {
      const { hostname } = new URL(normalized);
      const validHost = hostname === 'localhost' || /\.[a-z]{2,}$/i.test(hostname);
      if (!validHost) throw new Error();
    } catch {
      setError('Please enter a valid URL — e.g. https://example.com');
      return;
    }

    setScanning(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress(p => p < 88 ? p + Math.random() * 6 : p);
    }, 250);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Scan failed.'); return; }
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => router.push(`/result/${data.id}`), 300);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!scanning) { setScanning(false); setProgress(0); }
    }
  }

  const circumference = 2 * Math.PI * 20;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="rounded-2xl p-2 flex items-center gap-2"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}
      >
        <div className="flex-1 flex items-center gap-2 px-3">
          <i className="ri-link text-slate-400 text-lg shrink-0"></i>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !scanning && handleScan()}
            placeholder="Enter a URL to scan — e.g. https://suspicious-site.com"
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none py-3"
            disabled={scanning}
          />
        </div>
        <button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shrink-0"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
        >
          {scanning ? (
            <>
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke="white" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${circumference * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.25s ease' }}
                />
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <i className="ri-scan-line"></i>
              Scan Now
            </>
          )}
        </button>
      </div>
      {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
      <p className="mt-3 text-center text-xs text-slate-500">No account required · Results in seconds</p>
    </div>
  );
}
