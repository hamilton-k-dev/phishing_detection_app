interface Stats {
  total: number;
  safe: number;
  suspicious: number;
  phishing: number;
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    { label: 'Total Scans', value: stats.total.toLocaleString(), icon: 'ri-scan-line', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)' },
    { label: 'Safe Websites', value: stats.safe.toLocaleString(), icon: 'ri-shield-check-line', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Suspicious', value: stats.suspicious.toLocaleString(), icon: 'ri-alert-line', color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
    { label: 'Phishing Detected', value: stats.phishing.toLocaleString(), icon: 'ri-skull-line', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-xl p-4 sm:p-5 flex flex-col gap-3"
          style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
              <i className={`${s.icon} text-lg sm:text-xl`} style={{ color: s.color }}></i>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">
              {s.label === 'Total Scans' ? 'all time' :
               s.label === 'Safe Websites' && stats.total > 0 ? `${Math.round(stats.safe / stats.total * 100)}% of total` :
               s.label === 'Suspicious' && stats.total > 0 ? `${Math.round(stats.suspicious / stats.total * 100)}% of total` :
               s.label === 'Phishing Detected' && stats.total > 0 ? `${Math.round(stats.phishing / stats.total * 100)}% of total` :
               'no scans yet'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
