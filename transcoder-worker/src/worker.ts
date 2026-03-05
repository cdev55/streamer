import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '../.env') });

import { initRabbitMQ } from './config/rabbitmq';
import { startStreamEndedConsumer } from './consumers/streamEnded.consumer';
import { logger } from './utils/logger';

async function main() {
  await initRabbitMQ();
  await startStreamEndedConsumer();
  logger.info('TRANSCODER WORKER STARTED');
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
