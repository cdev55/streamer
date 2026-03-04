import path from 'path';
import { config } from 'dotenv';

// Load root .env (monorepo)
config({ path: path.resolve(process.cwd(), '../.env') });

import { connectWithRetry } from '@streamer/database';
import { app } from './app';
import { env } from './config/env';

async function main() {
  await connectWithRetry();
  app.listen(env.PORT, () => {
    console.log(`Auth service listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
