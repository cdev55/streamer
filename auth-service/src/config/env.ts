import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  RABBITMQ_URL: z.string().optional(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
