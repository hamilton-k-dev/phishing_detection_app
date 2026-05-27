'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#080c18' }}>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-35 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopNav
        sidebarCollapsed={collapsed}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${
          collapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}
      >
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
