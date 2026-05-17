import { Router } from 'express';
import { viewerController } from './viewer.controller';

const router = Router();

router.post('/:id/viewer-join', viewerController.join);
router.post('/:id/viewer-heartbeat', viewerController.heartbeat);
router.post('/:id/viewer-leave', viewerController.leave);
router.get('/:id/viewer-count', viewerController.getViewerCount);

export const viewerRoutes = router;
