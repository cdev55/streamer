import { getRabbitChannel } from '../config/rabbitmq';
import { ROUTING_KEYS } from './routingKeys';

const EXCHANGE = 'streams';

export async function publishStreamEvent(
  routingKey: keyof typeof ROUTING_KEYS,
  payload: object
): Promise<void> {
  const channel = await getRabbitChannel();
  if (!channel) return;
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  const key = ROUTING_KEYS[routingKey as keyof typeof ROUTING_KEYS] ?? (routingKey as string);
  channel.publish(EXCHANGE, key, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
}
