import { getChannel } from '../config/rabbitmq';

const EXCHANGE = 'stream.events';

export async function publishEvent(routingKey: string, payload: unknown): Promise<void> {
  try {
    const ch = getChannel();
    if (!ch) return;

    const buffer = Buffer.from(JSON.stringify(payload));
    ch.publish(EXCHANGE, routingKey, buffer, { persistent: true });
  } catch (err) {
    console.error('[RabbitMQ] publishEvent failed:', err);
  }
}
