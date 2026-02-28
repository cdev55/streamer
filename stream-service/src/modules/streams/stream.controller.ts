import { Request, Response } from 'express';
import { streamService } from './stream.service';

export const streamController = {
  async create(req: Request, res: Response) {
    const userId = (req as any).userId;
    const result = await streamService.create(userId, req.body);
    res.status(201).json(result);
  },

  async list(req: Request, res: Response) {
    const userId = (req as any).userId;
    const streams = await streamService.listByUser(userId);
    res.json(streams);
  },

  async getById(req: Request, res: Response) {
    const stream = await streamService.getById(req.params.id);
    if (!stream) return res.status(404).json({ error: 'Stream not found' });
    res.json(stream);
  },
};
