import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from './auth.validation';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.post('/register', validate.register, authController.register);
router.post('/login', validate.login, authController.login);
router.get('/me', authMiddleware, authController.me);

export const authRoutes = router;
