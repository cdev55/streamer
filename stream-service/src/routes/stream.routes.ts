import { Router } from 'express';
import { streamController } from '../controllers/stream.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, streamController.create);
router.get('/me', authMiddleware, streamController.me);
router.get('/live', streamController.getLive);
router.get('/:id/playback', streamController.getPlayback);
router.get('/:id/state', streamController.getState);
router.get('/:id', streamController.getById);
router.post('/:id/start', authMiddleware, streamController.start);
router.post('/:id/end', authMiddleware, streamController.end);

export const streamRoutes = router;
