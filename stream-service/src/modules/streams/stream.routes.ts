import { Router } from 'express';
import { streamController } from './stream.controller';
import { validate } from './stream.validation';

const router = Router();
router.post('/', validate.create, streamController.create);
router.get('/', streamController.list);
router.get('/:id', streamController.getById);

export const streamRoutes = router;
