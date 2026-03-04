import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { db: PrismaClient | undefined };

export const db =
  globalForPrisma.db ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.db = db;
}

const DEFAULT_MAX_RETRIES = 15;
const DEFAULT_DELAY_MS = 3000;

export async function connectWithRetry(
  options: { maxRetries?: number; delayMs?: number } = {}
): Promise<void> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelayMs = options.delayMs ?? DEFAULT_DELAY_MS;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await db.$connect();
      if (attempt > 1) {
        console.log(`[Database] Connected on attempt ${attempt}`);
      }
      return;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Database] Connection attempt ${attempt}/${maxRetries} failed:`, msg);
      if (attempt === maxRetries) {
        throw err;
      }
      const delayMs = baseDelayMs * Math.min(attempt, 3);
      console.log(`[Database] Retrying in ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
