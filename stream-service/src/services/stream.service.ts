import { db } from '@streamer/database';
import { redis } from '../config/redis';
import { publishEvent } from '../events/publisher';
import { STREAM_STARTED, STREAM_ENDED } from '../events/routingKeys';

const STATE_KEY = (streamId: string) => `stream:${streamId}:state`;
const SESSION_KEY = (streamId: string) => `stream:${streamId}:session`;

export type RedisState = 'LIVE' | 'OFFLINE';

async function setStreamState(streamId: string, state: RedisState): Promise<void> {
  try {
    await redis.set(STATE_KEY(streamId), state);
  } catch (err) {
    console.error('[Redis] setStreamState failed:', err);
  }
}

async function setStreamSession(streamId: string, sessionId: string): Promise<void> {
  try {
    await redis.set(SESSION_KEY(streamId), sessionId);
  } catch (err) {
    console.error('[Redis] setStreamSession failed:', err);
  }
}

async function deleteStreamSession(streamId: string): Promise<void> {
  try {
    await redis.del(SESSION_KEY(streamId));
  } catch (err) {
    console.error('[Redis] deleteStreamSession failed:', err);
  }
}

export async function getStreamStateFromRedis(streamId: string): Promise<RedisState | null> {
  try {
    const val = await redis.get(STATE_KEY(streamId));
    if (val === 'LIVE' || val === 'OFFLINE') return val;
    return null;
  } catch (err) {
    console.error('[Redis] getStreamState failed:', err);
    return null;
  }
}

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
    const stream = await db.stream.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
    if (!stream) return null;

    const redisState = await getStreamStateFromRedis(id);
    return {
      ...stream,
      redisState: redisState ?? undefined,
    };
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

    await setStreamState(streamId, 'LIVE');
    await setStreamSession(streamId, session.id);

    try {
      await publishEvent(STREAM_STARTED, {
        streamId,
        userId,
        sessionId: session.id,
        startedAt: session.startedAt,
      });
    } catch (err) {
      console.error('[RabbitMQ] Failed to publish STREAM_STARTED:', err);
    }

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

    await setStreamState(streamId, 'OFFLINE');
    await deleteStreamSession(streamId);

    try {
      await publishEvent(STREAM_ENDED, {
        streamId,
        userId,
        sessionId: activeSession.id,
        endedAt: updatedSession.endedAt,
      });
    } catch (err) {
      console.error('[RabbitMQ] Failed to publish STREAM_ENDED:', err);
    }

    return updatedSession;
  },
};
