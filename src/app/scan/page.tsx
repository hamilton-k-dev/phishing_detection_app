import { headers } from 'next/headers';
import DashboardLayout from '@/components/DashboardLayout';
import PublicLayout from '@/components/PublicLayout';
import ScanInput from './ScanInput';
import { auth } from '@/lib/auth';

export default async function ScanPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (session) {
    return (
      <DashboardLayout>
        <ScanInput />
      </DashboardLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="px-4 sm:px-6">
        <ScanInput />
      </div>
    </PublicLayout>
  );
}
