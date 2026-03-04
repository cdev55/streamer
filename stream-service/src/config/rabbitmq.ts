import amqplib from 'amqplib';
import { env } from './env';

const EXCHANGE = 'stream.events';

let conn: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

async function connectToRabbit(): Promise<void> {
  try {
    conn = await amqplib.connect(env.RABBITMQ_URL);
    channel = await conn.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

    conn.on('close', () => {
      console.log('[RabbitMQ] Connection closed');
      conn = null;
      channel = null;
      setTimeout(connectToRabbit, 3000);
    });

    conn.on('error', (err) => {
      console.error('[RabbitMQ] Connection error:', err.message);
    });

    console.log('[RabbitMQ] Connected');
  } catch (err) {
    console.error('[RabbitMQ] Failed to connect:', err);
    setTimeout(connectToRabbit, 3000);
  }
}

export function getConnection(): amqplib.Connection | null {
  return conn;
}

export function getChannel(): amqplib.Channel | null {
  return channel;
}

export async function initRabbitMQ(): Promise<void> {
  connectToRabbit();
}
