import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const secret = env.JWT_SECRET;

export function signToken(payload: { userId: string }, expiresIn = '7d'): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, secret) as { userId: string };
}
