import amqplib from 'amqplib';
import { env } from './env';
import { logger } from '../utils/logger';

const EXCHANGE = 'stream.events';
const QUEUE = 'transcoder.stream.ended';
const ROUTING_KEY = 'stream.ended';

let conn: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

async function connect(): Promise<void> {
  try {
    conn = await amqplib.connect(env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
    conn.on('close', () => {
      logger.info('[RabbitMQ] Connection closed');
      conn = null;
      channel = null;
      setTimeout(connect, 3000);
    });
    conn.on('error', (err) => logger.error('[RabbitMQ]', err));
    logger.info('[RabbitMQ] Connected');
  } catch (err) {
    logger.error('[RabbitMQ] Failed to connect', err);
    setTimeout(connect, 3000);
  }
}

export async function getChannel(): Promise<amqplib.Channel | null> {
  return channel;
}

export async function initRabbitMQ(): Promise<void> {
  while (!channel) {
    await connect();
    if (!channel) await new Promise((r) => setTimeout(r, 3000));
  }
}

export const RABBIT = { EXCHANGE, QUEUE, ROUTING_KEY };
