import './env-loader';

import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
import { auth } from '../src/lib/auth';
import { prisma } from '../src/lib/db';

neonConfig.webSocketConstructor = ws;

async function main() {
  console.log('Seeding demo user…');

  const existing = await prisma.user.findUnique({ where: { email: 'demo@phishguard.com' } });
  if (existing) {
    console.log('Demo user already exists, skipping.');
    return;
  }

  await auth.api.signUpEmail({
    body: {
      email: 'demo@phishguard.com',
      password: 'demo1234',
      name: 'Security Analyst',
    },
  });

  await prisma.user.update({
    where: { email: 'demo@phishguard.com' },
    data: { emailVerified: true },
  });

  console.log('✓ Demo user created');
  console.log('  Email:    demo@phishguard.com');
  console.log('  Password: demo1234');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
