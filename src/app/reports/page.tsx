'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { topDomains } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';

const pieData = [
  { name: 'Safe', value: 947, color: '#22c55e' },
  { name: 'Suspicious', value: 218, color: '#eab308' },
  { name: 'Phishing', value: 119, color: '#ef4444' },
];

const barData = [
  { month: 'Jan', phishing: 45, safe: 210 },
  { month: 'Feb', phishing: 52, safe: 198 },
  { month: 'Mar', phishing: 61, safe: 245 },
  { month: 'Apr', phishing: 38, safe: 189 },
];

const summaryCards = [
  { label: 'Total This Month', value: '342', icon: 'ri-scan-line', color: '#00d4ff' },
  { label: 'Phishing Rate', value: '9.3%', icon: 'ri-percent-line', color: '#ef4444' },
  { label: 'Avg Risk Score', value: '28.4', icon: 'ri-bar-chart-line', color: '#eab308' },
  { label: 'Top Threat Domain', value: 'paypal-secure-login.xyz', icon: 'ri-global-line', color: '#ef4444', small: true },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Visual insights and threat summaries</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {summaryCards.map(c => (
            <div key={c.label} className="rounded-xl p-4 sm:p-5" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}18` }}>
                  <i className={`${c.icon} text-lg`} style={{ color: c.color }}></i>
                </div>
              </div>
              <p className={`font-bold text-white mb-1 ${c.small ? 'text-xs break-all' : 'text-xl sm:text-2xl'}`} style={{ color: c.color }}>{c.value}</p>
              <p className="text-xs text-slate-500">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 rounded-xl p-5" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Monthly Phishing vs Safe</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="safe" fill="#22c55e" radius={[4, 4, 0, 0]} name="Safe" />
                <Bar dataKey="phishing" fill="#ef4444" radius={[4, 4, 0, 0]} name="Phishing" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 rounded-xl p-5" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Detection Breakdown</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="text-center">
                  <p className="text-base font-bold" style={{ color: d.color }}>{Math.round(d.value / 1284 * 100)}%</p>
                  <p className="text-xs text-slate-500">{d.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="px-5 py-4 border-b border-cyan-900/20">
            <h3 className="text-sm font-semibold text-white">Most Scanned Domains</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(0,212,255,0.03)' }}>
                  {['Domain', 'Total Scans', 'Verdict'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topDomains.map((d, i) => (
                  <tr key={i} className="border-t border-cyan-900/10 hover:bg-cyan-500/5 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-slate-300 whitespace-nowrap">{d.domain}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 min-w-30">
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden w-16 sm:w-24">
                          <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(d.scans / 47) * 100}%` }}></div>
                        </div>
                        <span className="text-sm text-slate-400">{d.scans}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={d.result} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
