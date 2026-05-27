import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  const scans = await prisma.scan.findMany({
    where: session?.user?.id ? { userId: session.user.id } : {},
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      url: true,
      result: true,
      riskScore: true,
      createdAt: true,
    },
  });

  return NextResponse.json(scans);
}
