import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const secret = env.JWT_SECRET;
const EXPIRES_IN = '7d';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, secret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, secret) as { userId: string };
}
