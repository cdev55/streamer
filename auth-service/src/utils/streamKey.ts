import crypto from 'crypto';

/** Generate a random stream key, 48 characters (hex = 24 bytes) */
export function generateStreamKey(): string {
  return crypto.randomBytes(24).toString('hex');
}
