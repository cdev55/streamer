import { getRabbitChannel } from '../config/rabbitmq';
import { ffmpegService } from '../services/ffmpeg.service';
import { uploadService } from '../services/upload.service';

const QUEUE = 'stream.ended';
const EXCHANGE = 'streams';
const ROUTING_KEY = 'stream.ended';

export async function startStreamEndedConsumer() {
  const channel = await getRabbitChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString()) as { streamId: string };
      // Transcode and upload
      const outputPath = await ffmpegService.transcode(payload.streamId);
      await uploadService.upload(outputPath, payload.streamId);
      channel.ack(msg);
    } catch (err) {
      console.error('streamEnded consumer error:', err);
      channel.nack(msg, false, true);
    }
  });
}
