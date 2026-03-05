import path from 'path';
import fs from 'fs/promises';
import { getChannel } from '../config/rabbitmq';
import { env } from '../config/env';
import { db } from '@streamer/database';
import { generateAbrHls } from '../services/abr.service';
import { uploadVodDirectory } from '../services/upload.service';
import { logger } from '../utils/logger';
import { RABBIT } from '../config/rabbitmq';

interface StreamEndedPayload {
  streamId: string;
  userId: string;
  sessionId: string;
  endedAt: string;
}

async function findMostRecentMp4(streamKey: string): Promise<string | null> {
  const dir = path.join(env.RECORDINGS_PATH, streamKey);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const mp4s = entries
      .filter((e) => e.isFile() && e.name.endsWith('.mp4'))
      .map((e) => path.join(dir, e.name));
    if (mp4s.length === 0) return null;
    const stats = await Promise.all(
      mp4s.map(async (f) => ({ path: f, mtime: (await fs.stat(f)).mtimeMs }))
    );
    stats.sort((a, b) => b.mtime - a.mtime);
    return stats[0].path;
  } catch {
    const fallbackDir = path.join(env.RECORDINGS_PATH, 'live', streamKey);
    try {
      const entries = await fs.readdir(fallbackDir, { withFileTypes: true });
      const mp4s = entries
        .filter((e) => e.isFile() && e.name.endsWith('.mp4'))
        .map((e) => path.join(fallbackDir, e.name));
      if (mp4s.length === 0) return null;
      const stats = await Promise.all(
        mp4s.map(async (f) => ({ path: f, mtime: (await fs.stat(f)).mtimeMs }))
      );
      stats.sort((a, b) => b.mtime - a.mtime);
      return stats[0].path;
    } catch {
      return null;
    }
  }
}

async function rmDirRecursive(dir: string): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await rmDirRecursive(full);
      else await fs.unlink(full);
    }
    await fs.rmdir(dir);
  } catch {
    // ignore
  }
}

export async function startStreamEndedConsumer(): Promise<void> {
  const channel = await getChannel();
  if (!channel) {
    logger.error('[Consumer] No RabbitMQ channel');
    return;
  }
  await channel.consume(
    RABBIT.QUEUE,
    async (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString()) as StreamEndedPayload;
        const { streamId, sessionId } = payload;
        logger.info('[Consumer] stream.ended', { streamId, sessionId });

        const stream = await db.stream.findUnique({
          where: { id: streamId },
          include: { user: { select: { streamKey: true } } },
        });
        if (!stream) {
          logger.error('[Consumer] Stream not found', streamId);
          channel.ack(msg);
          return;
        }
        const streamKey = stream.user.streamKey;
        const inputPath = await findMostRecentMp4(streamKey);
        if (!inputPath) {
          logger.error('[Consumer] No recording found for', streamKey);
          channel.ack(msg);
          return;
        }

        const outputDir = path.join('/tmp', streamId);

        logger.info('TRANSCODING STARTED', { streamId });
        await generateAbrHls(inputPath, outputDir);
        logger.info('TRANSCODING COMPLETED', { streamId });

        logger.info('UPLOAD STARTED', { streamId });
        const baseUrl = await uploadVodDirectory(streamId, outputDir);
        logger.info('UPLOAD COMPLETED', { streamId });

        const vodUrl = `${baseUrl}/master.m3u8`;
        await db.stream.update({
          where: { id: streamId },
          data: { vodUrl } as { vodUrl: string },
        });

        await rmDirRecursive(outputDir);
        logger.info('[Consumer] VOD ready', { streamId, vodUrl });
        channel.ack(msg);
      } catch (err) {
        logger.error('[Consumer] Job failed', err);
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
  logger.info('[Consumer] Listening on queue', RABBIT.QUEUE);
}
