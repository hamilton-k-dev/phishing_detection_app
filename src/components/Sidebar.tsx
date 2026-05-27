'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { href: '/', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { href: '/scan', icon: 'ri-search-eye-line', label: 'Scan URL' },
  { href: '/history', icon: 'ri-history-line', label: 'Scan History' },
  { href: '/reports', icon: 'ri-bar-chart-2-line', label: 'Reports' },
  { href: '/settings', icon: 'ri-settings-3-line', label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300
        w-60
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${collapsed ? 'lg:w-16' : 'lg:w-60'}
      `}
      style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1224 100%)', borderRight: '1px solid rgba(0,212,255,0.1)' }}
    >
      <div className={`flex items-center h-16 px-3 border-b border-cyan-900/30 gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
        <button
          onClick={onMobileClose}
          className="lg:hidden w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <i className="ri-shield-check-fill text-2xl text-cyan-400"></i>
        </div>
        <span className={`text-white font-bold text-base tracking-wide whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>
          PhishGuard
        </span>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-cyan-900/30 hidden lg:block">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-lg`}></i>
          </div>
          {!collapsed && <span className="text-sm whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
