import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const validate = {
  register: (req: Request, res: Response, next: NextFunction) => {
    const result = registerSchema.safeParse(req);
    if (!result.success) return res.status(400).json(result.error.flatten());
    next();
  },
  login: (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req);
    if (!result.success) return res.status(400).json(result.error.flatten());
    next();
  },
};
