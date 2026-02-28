import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let channel: amqp.Channel | null = null;

export async function getRabbitChannel(): Promise<amqp.Channel> {
  if (channel) return channel;
  const conn = await amqp.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  return channel;
}
