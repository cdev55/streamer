import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '../.env') });

import './config/redis';
import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Stream service listening on port ${env.PORT}`);
});
