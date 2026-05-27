'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { scanTimelineData } from '@/lib/mockData';

export default function ScanLineChart() {
  return (
    <div className="rounded-xl p-5 h-full" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Scan Activity Timeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">Last 30 days</p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,212,255,0.08)' }}>
          <div className="w-3 h-3 flex items-center justify-center">
            <i className="ri-calendar-line text-xs text-cyan-400"></i>
          </div>
          <span className="text-xs text-cyan-400">Mar – Apr 2026</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={scanTimelineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Line type="monotone" dataKey="safe" stroke="#22c55e" strokeWidth={2} dot={false} name="Safe" />
          <Line type="monotone" dataKey="suspicious" stroke="#eab308" strokeWidth={2} dot={false} name="Suspicious" />
          <Line type="monotone" dataKey="phishing" stroke="#ef4444" strokeWidth={2} dot={false} name="Phishing" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
