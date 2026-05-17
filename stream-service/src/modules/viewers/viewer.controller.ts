import { Request, Response } from 'express';
import { viewerService } from './viewer.service';

export const viewerController = {
  async join(req: Request, res: Response) {
    const { id } = req.params;
    const { sessionId } = req.body;
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required' });
    }
    try {
      const result = await viewerService.join(id, sessionId);
      console.log('[VIEWER_JOIN]', { streamId: id, sessionId });
      res.json(result);
    } catch (err) {
      console.error('[ViewerController] join error:', err);
      res.status(500).json({ error: 'Failed to join stream' });
    }
  },

  async heartbeat(req: Request, res: Response) {
    const { id } = req.params;
    const { sessionId } = req.body;
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required' });
    }
    try {
      const result = await viewerService.heartbeat(id, sessionId);
      console.log('[VIEWER_HEARTBEAT]', { streamId: id, sessionId });
      res.json(result);
    } catch (err) {
      console.error('[ViewerController] heartbeat error:', err);
      res.status(500).json({ error: 'Failed to send heartbeat' });
    }
  },

  async leave(req: Request, res: Response) {
    const { id } = req.params;
    const { sessionId } = req.body;
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required' });
    }
    try {
      const result = await viewerService.leave(id, sessionId);
      console.log('[VIEWER_LEAVE]', { streamId: id, sessionId });
      res.json(result);
    } catch (err) {
      console.error('[ViewerController] leave error:', err);
      res.status(500).json({ error: 'Failed to leave stream' });
    }
  },

  async getViewerCount(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const viewerCount = await viewerService.getViewerCount(id);
      res.json({ viewerCount });
    } catch (err) {
      console.error('[ViewerController] getViewerCount error:', err);
      res.status(500).json({ error: 'Failed to get viewer count' });
    }
  },
};
