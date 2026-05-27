'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Safe', value: 947, color: '#22c55e' },
  { name: 'Suspicious', value: 218, color: '#eab308' },
  { name: 'Phishing', value: 119, color: '#ef4444' },
];

export default function ScanPieChart() {
  return (
    <div className="rounded-xl p-5 h-full" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Detection Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">All time results</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {data.map((d) => (
          <div key={d.name} className="text-center">
            <p className="text-lg font-bold" style={{ color: d.color }}>{Math.round(d.value / 1284 * 100)}%</p>
            <p className="text-xs text-slate-500">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
