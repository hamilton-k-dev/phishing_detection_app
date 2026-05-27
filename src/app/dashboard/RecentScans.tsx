import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBar from '@/components/ui/RiskBar';

interface ScanRow {
  id: string;
  url: string;
  result: 'safe' | 'suspicious' | 'phishing';
  riskScore: number;
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function RecentScans({ scans }: { scans: ScanRow[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-900/20">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        <Link href="/history" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">View All →</Link>
      </div>

      {scans.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <i className="ri-scan-line text-3xl text-slate-700 block mb-3"></i>
          <p className="text-slate-500 text-sm mb-1">No scans yet.</p>
          <Link href="/scan" className="text-xs text-cyan-400 hover:text-cyan-300">
            Scan your first URL →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(0,212,255,0.03)' }}>
                {['URL', 'Status', 'Risk Score', 'Timestamp', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-t border-cyan-900/10 hover:bg-cyan-500/5 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-slate-300 truncate block max-w-xs">{scan.url}</span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={scan.result} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 min-w-25">
                      <RiskBar score={scan.riskScore} showLabel />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-slate-500">{formatDate(scan.createdAt)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/result/${scan.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer">
                      <i className="ri-eye-line text-sm"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
