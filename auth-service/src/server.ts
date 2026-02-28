import path from 'path';
import { config } from 'dotenv';

// Load root .env (monorepo)
config({ path: path.resolve(process.cwd(), '../.env') });

import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Auth service listening on port ${env.PORT}`);
});
