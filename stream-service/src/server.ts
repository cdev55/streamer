import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '../.env') });

import { connectWithRetry } from '@streamer/database';
import './config/redis';
import { initRabbitMQ } from './config/rabbitmq';
import { app } from './app';

initRabbitMQ();
import { env } from './config/env';
import { startViewerCleanup } from './modules/viewers/viewer.cleanup';

async function main() {
  startViewerCleanup();
  await connectWithRetry();
  app.listen(env.PORT, () => {
    console.log(`Stream service listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
