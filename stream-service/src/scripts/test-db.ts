import { prisma } from '../config/db';

async function main() {
  console.log('Creating user...');
  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed_password_placeholder',
      streamKey: 'sk_test_abc123',
    },
  });
  console.log('Created user:', user);

  console.log('Creating stream...');
  const stream = await prisma.stream.create({
    data: {
      userId: user.id,
      title: 'My First Stream',
      description: 'A test stream',
      isLive: false,
    },
  });
  console.log('Created stream:', stream);

  console.log('Creating stream session...');
  const session = await prisma.streamSession.create({
    data: {
      streamId: stream.id,
      startedAt: new Date(),
      peakViewers: 0,
    },
  });
  console.log('Created stream session:', session);

  console.log('Fetching user with streams and sessions...');
  const fetched = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      streams: {
        include: {
          sessions: true,
        },
      },
    },
  });
  console.log('Fetched data:', JSON.stringify(fetched, null, 2));

  await prisma.streamSession.delete({ where: { id: session.id } });
  await prisma.stream.delete({ where: { id: stream.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Test data cleaned up.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
