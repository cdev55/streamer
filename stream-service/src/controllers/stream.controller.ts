import { Request, Response } from 'express';
import { streamService } from '../services/stream.service';

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
    res.json(stream);
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
};
