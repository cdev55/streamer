import amqp from 'amqplib';
import { env } from './env';

let channel: amqp.Channel | null = null;

export async function getRabbitChannel(): Promise<amqp.Channel | null> {
  if (!env.RABBITMQ_URL) return null;
  if (channel) return channel;
  const conn = await amqp.connect(env.RABBITMQ_URL);
  channel = await conn.createChannel();
  return channel;
}
