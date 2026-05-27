'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';

interface TopNavProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

const notifications = [
  { id: 1, text: 'Phishing site detected: fake-paypal.com', time: '2m ago', type: 'danger' },
  { id: 2, text: 'Scan completed: google.com — Safe', time: '15m ago', type: 'safe' },
  { id: 3, text: 'Suspicious URL flagged for review', time: '1h ago', type: 'warning' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TopNav({ sidebarCollapsed, onMobileMenuToggle }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const userName = session?.user?.name ?? 'Security Analyst';
  const initials = getInitials(userName);

  async function handleSignOut() {
    setShowProfile(false);
    await signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-30 flex items-center px-3 sm:px-6 gap-3 transition-all duration-300 left-0 ${
        sidebarCollapsed ? 'lg:left-16' : 'lg:left-60'
      }`}
      style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}
    >
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer shrink-0"
      >
        <i className="ri-menu-line text-xl"></i>
      </button>

      <div className="flex-1 min-w-0 max-w-lg hidden sm:block">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400">
            <i className="ri-search-line text-sm"></i>
          </div>
          <input
            type="text"
            placeholder="Search URLs or scan history..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg text-slate-300 placeholder-slate-500 outline-none focus:ring-1 focus:ring-cyan-500/50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer"
          >
            <i className="ri-notification-3-line text-lg"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="px-4 py-3 border-b border-cyan-900/30">
                <span className="text-sm font-semibold text-white">Notifications</span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 hover:bg-cyan-500/5 cursor-pointer border-b border-cyan-900/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'danger' ? 'bg-red-500' : n.type === 'safe' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <p className="text-xs text-slate-300">{n.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <span className="text-sm text-slate-300 whitespace-nowrap hidden sm:inline">{userName}</span>
            <div className="w-4 h-4 items-center justify-center text-slate-400 hidden sm:flex">
              <i className="ri-arrow-down-s-line text-sm"></i>
            </div>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-48 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: '#0d1224', border: '1px solid rgba(0,212,255,0.2)' }}>
              {[
                { icon: 'ri-user-line', label: 'Profile', onClick: () => setShowProfile(false) },
                { icon: 'ri-settings-3-line', label: 'Settings', onClick: () => setShowProfile(false) },
              ].map((item) => (
                <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-cyan-900/20">
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-logout-box-r-line text-sm"></i>
                  </div>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
