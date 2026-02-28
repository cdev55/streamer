const required = (name: string): string => {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
};

export const env = {
  PORT: Number(process.env.PORT) || 4001,
  JWT_SECRET: required('JWT_SECRET'),
};
