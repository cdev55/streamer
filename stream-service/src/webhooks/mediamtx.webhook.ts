import { Request, Response } from 'express';
import { db } from '@streamer/database';
import { streamService } from '../services/stream.service';

interface WebhookBody {
  path?: string;
}

export async function handleStreamStart(req: Request, res: Response): Promise<void> {
  console.log('[MediaMTX] STREAM STARTED', req.body);
  const body = req.body as WebhookBody;
  let streamKey = body.path?.trim();
  streamKey = streamKey?.split('/').pop();

  if (!streamKey) {
    res.status(400).json({ error: 'Missing path (stream key)' });
    return;
  }

  const user = await db.user.findUnique({
    where: { streamKey },
    include: {
      streams: { where: { isLive: false }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found for stream key' });
    return;
  }

  const stream = user.streams[0];
  if (!stream) {
    const liveStream = await db.stream.findFirst({
      where: { userId: user.id, isLive: true },
    });
    if (liveStream) {
      console.log('[MediaMTX] STREAM STARTED (idempotent) – already live', {
        streamId: liveStream.id,
        userId: user.id,
      });
      res.status(200).json({ ok: true, alreadyLive: true });
      return;
    }
    res.status(404).json({ error: 'No stream found for user' });
    return;
  }

  try {
    await streamService.startStream(user.id, stream.id);
    console.log('[MediaMTX] STREAM STARTED', { streamId: stream.id, userId: user.id });
    res.status(200).json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('already live')) {
      console.log('[MediaMTX] STREAM STARTED (idempotent) – already live', {
        streamId: stream.id,
        userId: user.id,
      });
      res.status(200).json({ ok: true, alreadyLive: true });
      return;
    }
    throw err;
  }
}

export async function handleStreamEnd(req: Request, res: Response): Promise<void> {
  console.log('[MediaMTX] STREAM ENDED', req.body);
  const body = req.body as WebhookBody;
  let streamKey = body.path?.trim();
  streamKey = streamKey?.split('/').pop();
  if (!streamKey) {
    res.status(400).json({ error: 'Missing path (stream key)' });
    return;
  }

  const user = await db.user.findUnique({
    where: { streamKey },
    include: {
      streams: { where: { isLive: true }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found for stream key' });
    return;
  }

  const stream = user.streams[0];
  if (!stream) {
    console.log('[MediaMTX] STREAM ENDED (idempotent) – already offline', {
      userId: user.id,
    });
    res.status(200).json({ ok: true, alreadyOffline: true });
    return;
  }

  try {
    await streamService.endStream(user.id, stream.id);
    console.log('[MediaMTX] STREAM ENDED', { streamId: stream.id, userId: user.id });
    res.status(200).json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('not live')) {
      console.log('[MediaMTX] STREAM ENDED (idempotent) – already offline', {
        streamId: stream.id,
        userId: user.id,
      });
      res.status(200).json({ ok: true, alreadyOffline: true });
      return;
    }
    throw err;
  }
}
