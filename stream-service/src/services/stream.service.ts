import { db } from '@streamer/database';

export interface CreateStreamInput {
  title: string;
  description?: string;
}

export const streamService = {
  async create(userId: string, input: CreateStreamInput) {
    return db.stream.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        isLive: false,
      },
    });
  },

  async getById(id: string) {
    return db.stream.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
  },

  async listByUser(userId: string) {
    return db.stream.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async startStream(userId: string, streamId: string) {
    const stream = await db.stream.findUnique({ where: { id: streamId } });
    if (!stream) throw new Error('Stream not found');
    if (stream.userId !== userId) throw new Error('Forbidden');
    if (stream.isLive) throw new Error('Stream is already live');

    const [updated, session] = await db.$transaction([
      db.stream.update({
        where: { id: streamId },
        data: { isLive: true },
      }),
      db.streamSession.create({
        data: {
          streamId,
          startedAt: new Date(),
        },
      }),
    ]);

    return session;
  },

  async endStream(userId: string, streamId: string) {
    const stream = await db.stream.findUnique({
      where: { id: streamId },
      include: {
        sessions: { where: { endedAt: null }, orderBy: { startedAt: 'desc' }, take: 1 },
      },
    });

    if (!stream) throw new Error('Stream not found');
    if (stream.userId !== userId) throw new Error('Forbidden');
    if (!stream.isLive) throw new Error('Stream is not live');

    const activeSession = stream.sessions[0];
    if (!activeSession) throw new Error('No active session found');

    const [updatedSession] = await db.$transaction([
      db.streamSession.update({
        where: { id: activeSession.id },
        data: { endedAt: new Date() },
      }),
      db.stream.update({
        where: { id: streamId },
        data: { isLive: false },
      }),
    ]);

    return updatedSession;
  },
};
