import Link from 'next/link';
import type { ScanDetails } from '@/lib/scanner';

interface Scan {
  id: string;
  url: string;
  result: 'safe' | 'suspicious' | 'phishing';
  riskScore: number;
  details: ScanDetails;
  createdAt: string;
}

const statusConfig = {
  safe: { label: 'SAFE', icon: 'ri-shield-check-fill', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', color: '#22c55e' },
  suspicious: { label: 'SUSPICIOUS', icon: 'ri-alert-fill', gradient: 'linear-gradient(135deg, #ca8a04, #eab308)', color: '#eab308' },
  phishing: { label: 'PHISHING DETECTED', icon: 'ri-skull-2-fill', gradient: 'linear-gradient(135deg, #b91c1c, #ef4444)', color: '#ef4444' },
};

const detailConfig = {
  danger: { border: '#ef4444', icon: 'ri-close-circle-fill', iconColor: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  warning: { border: '#eab308', icon: 'ri-alert-fill', iconColor: '#eab308', bg: 'rgba(234,179,8,0.08)' },
  safe: { border: '#22c55e', icon: 'ri-checkbox-circle-fill', iconColor: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
};

const detailLabels: { key: keyof ScanDetails; label: string; icon: string }[] = [
  { key: 'domainAge', label: 'Domain Age', icon: 'ri-calendar-line' },
  { key: 'ssl', label: 'SSL Certificate', icon: 'ri-lock-line' },
  { key: 'urlLength', label: 'URL Structure', icon: 'ri-link-m' },
  { key: 'keywords', label: 'Suspicious Keywords', icon: 'ri-spam-2-line' },
  { key: 'externalLinks', label: 'External Links', icon: 'ri-external-link-line' },
  { key: 'reputation', label: 'Domain Reputation', icon: 'ri-star-line' },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function ResultDetail({ scan }: { scan: Scan }) {
  const sc = statusConfig[scan.result];
  const scoreColor = scan.riskScore >= 70 ? '#ef4444' : scan.riskScore >= 40 ? '#eab308' : '#22c55e';
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl overflow-hidden" style={{ background: sc.gradient }}>
        <div className="px-4 sm:px-8 py-8 sm:py-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <i className={`${sc.icon} text-3xl sm:text-4xl text-white`}></i>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-3">{sc.label}</h1>
          <p className="text-white/80 font-mono text-xs sm:text-sm break-all max-w-xl mx-auto">{scan.url}</p>
          <p className="text-white/60 text-xs mt-2">Scanned on {formatDate(scan.createdAt)}</p>
        </div>
      </div>

      <div className="flex justify-center -mt-2">
        <div className="rounded-2xl px-6 sm:px-10 py-6 flex flex-col items-center" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.15)' }}>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Risk Score</p>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke={scoreColor} strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - scan.riskScore / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color: scoreColor }}>{scan.riskScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
          <p className="text-sm font-semibold mt-2" style={{ color: scoreColor }}>
            {scan.riskScore >= 70 ? 'Critical Risk' : scan.riskScore >= 40 ? 'Moderate Risk' : 'Low Risk'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Detailed Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {detailLabels.map(({ key, label, icon }) => {
            const detail = scan.details[key];
            const dc = detailConfig[detail.status];
            return (
              <div
                key={key}
                className="rounded-xl p-4"
                style={{ background: dc.bg, border: `1px solid ${dc.border}30`, borderLeft: `3px solid ${dc.border}` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center text-slate-400">
                      <i className={`${icon} text-sm`}></i>
                    </div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${dc.icon} text-sm`} style={{ color: dc.iconColor }}></i>
                  </div>
                </div>
                <p className="text-lg font-bold text-white mb-1">{detail.value}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{detail.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
        <Link href="/scan" className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}>
          Scan Another URL
        </Link>
        <Link href="/history" className="px-6 py-2.5 rounded-xl font-semibold text-sm text-cyan-400 cursor-pointer transition-all hover:bg-cyan-500/10" style={{ border: '1px solid rgba(0,212,255,0.3)' }}>
          View History
        </Link>
        <button className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">Report False Positive</button>
      </div>
    </div>
  );
}
