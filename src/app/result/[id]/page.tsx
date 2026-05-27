import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PublicLayout from '@/components/PublicLayout';
import ResultDetail from './ResultDetail';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { ScanDetails } from '@/lib/scanner';
import Link from 'next/link';

const DEMO: Parameters<typeof ResultDetail>[0]['scan'] = {
  id: 'demo',
  url: 'https://paypal-secure-login.xyz/verify',
  result: 'phishing',
  riskScore: 94,
  createdAt: '2026-04-07T14:32:00.000Z',
  details: {
    domainAge: { value: '3 days', status: 'danger', note: 'Extremely new domain — high risk indicator.' },
    ssl: { value: 'Self-signed', status: 'danger', note: 'No trusted CA certificate found.' },
    urlLength: { value: '42 chars', status: 'warning', note: 'Unusually long URL with suspicious path.' },
    keywords: { value: '5 found', status: 'danger', note: 'Keywords: "secure", "login", "verify", "account", "update".' },
    externalLinks: { value: '18 links', status: 'warning', note: 'High number of external redirects detected.' },
    reputation: { value: 'Blacklisted', status: 'danger', note: 'Domain found in 3 threat intelligence feeds.' },
  },
};

function GuestBanner() {
  return (
    <div
      className="rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2"
      style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)' }}
    >
      <div className="flex items-center gap-3">
        <i className="ri-information-line text-cyan-400 text-lg shrink-0"></i>
        <p className="text-sm text-slate-300">
          <span className="text-white font-semibold">Create a free account</span> to save this scan and track all your results over time.
        </p>
      </div>
      <Link
        href="/login"
        className="px-4 py-2 rounded-lg text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #0066ff)' }}
      >
        Sign Up Free
      </Link>
    </div>
  );
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const isAuthenticated = !!session;

  if (id === 'demo') {
    if (isAuthenticated) {
      return <DashboardLayout><ResultDetail scan={DEMO} /></DashboardLayout>;
    }
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          <GuestBanner />
          <ResultDetail scan={DEMO} />
        </div>
      </PublicLayout>
    );
  }

  const raw = await prisma.scan.findUnique({ where: { id } });
  if (!raw) notFound();

  const scan = {
    id: raw.id,
    url: raw.url,
    result: raw.result as 'safe' | 'suspicious' | 'phishing',
    riskScore: raw.riskScore,
    createdAt: raw.createdAt.toISOString(),
    details: raw.details as unknown as ScanDetails,
  };

  if (isAuthenticated) {
    return <DashboardLayout><ResultDetail scan={scan} /></DashboardLayout>;
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <GuestBanner />
        <ResultDetail scan={scan} />
      </div>
    </PublicLayout>
  );
}
