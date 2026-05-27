import { headers } from 'next/headers';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCards from './dashboard/StatsCards';
import ScanLineChart from './dashboard/ScanLineChart';
import ScanPieChart from './dashboard/ScanPieChart';
import RecentScans from './dashboard/RecentScans';
import LandingPage from './LandingPage';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const [total, safe, suspicious, phishing] = await Promise.all([
    prisma.scan.count(),
    prisma.scan.count({ where: { result: 'safe' } }),
    prisma.scan.count({ where: { result: 'suspicious' } }),
    prisma.scan.count({ where: { result: 'phishing' } }),
  ]);

  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    return <LandingPage stats={{ total, safe, phishing }} />;
  }

  const recentRaw = await prisma.scan.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: { id: true, url: true, result: true, riskScore: true, createdAt: true },
  });

  const recentScans = recentRaw.map(s => ({
    ...s,
    result: s.result as 'safe' | 'suspicious' | 'phishing',
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back, {session.user.name ?? 'Security Analyst'}</p>
        </div>
        <StatsCards stats={{ total, safe, suspicious, phishing }} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <ScanLineChart />
          </div>
          <div className="lg:col-span-2">
            <ScanPieChart />
          </div>
        </div>
        <RecentScans scans={recentScans} />
      </div>
    </DashboardLayout>
  );
}
