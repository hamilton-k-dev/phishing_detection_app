import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeUrl } from '@/lib/scanner';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const raw = typeof body.url === 'string' ? body.url.trim() : '';
  if (!raw) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let normalized = raw;
  if (!normalized.startsWith('http')) normalized = 'https://' + normalized;

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  const { hostname } = parsed;
  const isValidHost = hostname === 'localhost' || /\.[a-z]{2,}$/i.test(hostname);
  if (!isValidHost) {
    return NextResponse.json({ error: 'Please enter a valid URL (e.g. https://example.com)' }, { status: 400 });
  }

  try {
    const analysis = await analyzeUrl(normalized);

    const scan = await prisma.scan.create({
      data: {
        url: normalized,
        result: analysis.result,
        riskScore: analysis.riskScore,
        details: analysis.details as unknown as import('@prisma/client').Prisma.InputJsonValue,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json({ id: scan.id });
  } catch (err) {
    console.error('[POST /api/scan]', err);
    return NextResponse.json({ error: 'Scan failed. Please try again.' }, { status: 500 });
  }
}
