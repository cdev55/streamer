import { Request, Response } from 'express';
import { streamService, getStreamStateFromRedis } from '../services/stream.service';
import { generatePlaybackUrl } from '../utils/playback';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const streamController = {
  async create(req: Request, res: Response) {
    const userId = req.userId!;
    const { title, description } = req.body;
    const stream = await streamService.create(userId, { title, description });
    res.status(201).json(stream);
  },

  async getById(req: Request, res: Response) {
    const stream = await streamService.getById(req.params.id);
    if (!stream) return res.status(404).json({ error: 'Stream not found' });
    res.json({
      id: stream.id,
      title: stream.title,
      isLive: stream.isLive,
      redisState: stream.redisState,
    });
  },

  async getState(req: Request, res: Response) {
    const state = await getStreamStateFromRedis(req.params.id);
    res.json({ state: state ?? 'OFFLINE' });
  },

  async start(req: Request, res: Response) {
    const userId = req.userId!;
    const session = await streamService.startStream(userId, req.params.id);
    res.json(session);
  },

  async end(req: Request, res: Response) {
    const userId = req.userId!;
    const session = await streamService.endStream(userId, req.params.id);
    res.json(session);
  },

  async me(req: Request, res: Response) {
    const userId = req.userId!;
    const streams = await streamService.listByUser(userId);
    res.json(streams);
  },

  async getPlayback(req: Request, res: Response) {
    const info = await streamService.getPlaybackInfo(req.params.id);
    if (!info) return res.status(404).json({ error: 'Stream not found' });
    if (!info.isLive) return res.json({ live: false });
    res.json({
      live: true,
      playbackUrl: generatePlaybackUrl(info.stream.user.streamKey),
    });
  },

  async getLive(req: Request, res: Response) {
    const streams = await streamService.getLiveStreamsForPlayback();
    res.json(streams);
  },
};
