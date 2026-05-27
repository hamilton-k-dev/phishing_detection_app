'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@securitycorp.com');
  const [role, setRole] = useState('Security Analyst');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ phishing: true, suspicious: true, weekly: false, email: true });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your profile and preferences</p>
        </div>

        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-400 text-sm font-medium" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-checkbox-circle-fill text-sm"></i></div>
            Settings saved successfully!
          </div>
        )}

        <div className="rounded-xl p-5 sm:p-6 space-y-5" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 flex items-center justify-center text-cyan-400"><i className="ri-user-line text-sm"></i></div>
            <h2 className="text-sm font-semibold text-white">User Profile</h2>
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl sm:text-2xl font-black text-white">AJ</div>
              <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center cursor-pointer hover:bg-cyan-400 transition-colors">
                <i className="ri-pencil-line text-xs text-white"></i>
              </button>
            </div>
            <div>
              <p className="text-white font-semibold">{name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{role}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: name, setter: setName },
              { label: 'Email Address', value: email, setter: setEmail },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
                <input
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg text-white outline-none focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg text-white outline-none focus:ring-1 focus:ring-cyan-500/50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 sm:p-6 space-y-4" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 flex items-center justify-center text-cyan-400"><i className="ri-palette-line text-sm"></i></div>
            <h2 className="text-sm font-semibold text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white font-medium">Theme</p>
              <p className="text-xs text-slate-500 mt-0.5">Choose your preferred color scheme</p>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${theme === t ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  style={theme === t ? { background: 'linear-gradient(135deg, #00d4ff22, #0066ff22)', border: '1px solid rgba(0,212,255,0.3)' } : {}}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${t === 'dark' ? 'ri-moon-line' : 'ri-sun-line'} text-sm`}></i>
                  </div>
                  <span className="hidden sm:inline">{t === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 sm:p-6 space-y-4" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 flex items-center justify-center text-cyan-400"><i className="ri-notification-3-line text-sm"></i></div>
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
          </div>
          {[
            { key: 'phishing', label: 'Phishing Alerts', desc: 'Get notified when a phishing site is detected' },
            { key: 'suspicious', label: 'Suspicious URL Flags', desc: 'Alerts for suspicious but unconfirmed threats' },
            { key: 'weekly', label: 'Weekly Summary', desc: 'Receive a weekly digest of scan activity' },
            { key: 'email', label: 'Email Notifications', desc: 'Send alerts to your registered email' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between gap-4 py-2 border-b border-cyan-900/10 last:border-0">
              <div className="min-w-0">
                <p className="text-sm text-white font-medium">{n.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
              </div>
              <button
                onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer shrink-0 ${notifs[n.key as keyof typeof notifs] ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifs[n.key as keyof typeof notifs] ? 'left-5' : 'left-0.5'}`}></span>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-8 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
        >
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
