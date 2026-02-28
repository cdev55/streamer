import path from 'path';
import { config } from 'dotenv';

// Load root .env so DATABASE_URL from monorepo root works
config({ path: path.resolve(__dirname, '../../.env') });

import { db } from './client';

async function main() {
  console.log('Connecting to database...');

  const user = await db.user.create({
    data: {
      username: `test-user-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'test-hash',
      streamKey: `test-stream-key-${Date.now()}`,
    },
  });
  console.log('Created user:', { id: user.id, username: user.username });

  const stream = await db.stream.create({
    data: {
      userId: user.id,
      title: 'Test Stream',
      description: 'Created by packages/database test script',
      isLive: false,
    },
  });
  console.log('Created stream:', { id: stream.id, title: stream.title });

  const startedAt = new Date();
  const session = await db.streamSession.create({
    data: {
      streamId: stream.id,
      startedAt,
      peakViewers: 0,
    },
  });
  console.log('Created stream session:', { id: session.id, streamId: session.streamId });

  // Cleanup test data
  await db.streamSession.delete({ where: { id: session.id } });
  await db.stream.delete({ where: { id: stream.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log('Cleaned up test data.');

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
