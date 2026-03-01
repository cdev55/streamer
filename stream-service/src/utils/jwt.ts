import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
}
