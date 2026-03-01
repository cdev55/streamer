const required = (name: string): string => {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
};

export const env = {
  PORT: Number(process.env.PORT) || 4002,
  JWT_SECRET: required('JWT_SECRET'),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
