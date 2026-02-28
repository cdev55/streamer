import { startStreamEndedConsumer } from './consumers/streamEnded.consumer';

async function main() {
  await startStreamEndedConsumer();
  console.log('Transcoder worker started');
}

main().catch(console.error);
