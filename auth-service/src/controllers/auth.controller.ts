import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authController = {
  async signup(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const result = await authService.signup({ username, email, password });
    res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  },

  async me(req: Request, res: Response) {
    const userId = req.userId!;
    const user = await authService.getMe(userId);
    res.json(user);
  },

  async streamKey(req: Request, res: Response) {
    const userId = req.userId!;
    const result = await authService.refreshStreamKey(userId);
    res.json(result);
  },
};
