import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const createSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const validate = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const result = createSchema.safeParse(req);
    if (!result.success) return res.status(400).json(result.error.flatten());
    next();
  },
};
