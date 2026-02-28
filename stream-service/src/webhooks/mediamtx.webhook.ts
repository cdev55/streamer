import { Router, Request, Response } from 'express';
import { streamService } from '../modules/streams/stream.service';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  // MediaMTX callback when stream starts/ends
  const { action, path } = req.body || {};
  if (action === 'read' && path) {
    // Stream ended – path may contain stream id
    await streamService.onStreamEnded(path);
  }
  res.status(200).send();
});

export const mediamtxWebhook = router;
