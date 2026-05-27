'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBar from '@/components/ui/RiskBar';
import Link from 'next/link';

type ScanResult = 'safe' | 'suspicious' | 'phishing';

interface ScanRow {
  id: string;
  url: string;
  result: ScanResult;
  riskScore: number;
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRow[] | null>(null);
  const [filter, setFilter] = useState<'all' | ScanResult>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/scans')
      .then(r => r.json())
      .then(setScans)
      .catch(() => setScans([]));
  }, []);

  const all = scans ?? [];
  const filtered = all.filter(s => {
    const matchFilter = filter === 'all' || s.result === filter;
    const matchSearch = s.url.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: all.length,
    safe: all.filter(s => s.result === 'safe').length,
    suspicious: all.filter(s => s.result === 'suspicious').length,
    phishing: all.filter(s => s.result === 'phishing').length,
  };

  const tabs: { key: 'all' | ScanResult; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'safe', label: 'Safe' },
    { key: 'suspicious', label: 'Suspicious' },
    { key: 'phishing', label: 'Phishing' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">Scan History</h1>
          <p className="text-sm text-slate-500 mt-0.5">All previously scanned URLs</p>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-4 border-b border-cyan-900/20 gap-3">
            <div className="flex items-center gap-1 flex-wrap">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${filter === t.key ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {t.label} <span className="ml-1 text-xs opacity-60">{counts[t.key]}</span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400">
                <i className="ri-search-line text-sm"></i>
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search URLs..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg text-slate-300 placeholder-slate-500 outline-none focus:ring-1 focus:ring-cyan-500/50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
              />
            </div>
          </div>

          {scans === null ? (
            <div className="px-5 py-12 text-center text-slate-500 text-sm">
              <i className="ri-loader-4-line text-2xl animate-spin text-cyan-500 block mb-3"></i>
              Loading scan history...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(0,212,255,0.03)' }}>
                    {['URL', 'Status', 'Risk Score', 'Date', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(scan => (
                    <tr key={scan.id} className="border-t border-cyan-900/10 hover:bg-cyan-500/5 transition-colors">
                      <td className="px-5 py-3 max-w-40 sm:max-w-xs">
                        <span className="text-xs font-mono text-slate-300 truncate block">{scan.url}</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap"><StatusBadge status={scan.result} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 min-w-25">
                          <RiskBar score={scan.riskScore} showLabel />
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-500">{formatDate(scan.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/result/${scan.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer">
                          <i className="ri-eye-line text-sm"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && scans.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <i className="ri-scan-line text-3xl text-slate-700 block mb-3"></i>
                        <p className="text-slate-500 text-sm">No scans yet.</p>
                        <Link href="/scan" className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 inline-block">
                          Scan your first URL →
                        </Link>
                      </td>
                    </tr>
                  )}
                  {filtered.length === 0 && scans.length > 0 && (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500 text-sm">No results match your filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
