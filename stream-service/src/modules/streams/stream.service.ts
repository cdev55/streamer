import { streamRepository } from './stream.repository';
import { publishStreamEvent } from '../../events/publisher';
import type { CreateStreamInput } from './stream.types';

export const streamService = {
  async create(userId: string, input: CreateStreamInput) {
    const stream = await streamRepository.create({ userId, ...input });
    return stream;
  },

  async listByUser(userId: string) {
    return streamRepository.findByUserId(userId);
  },

  async getById(id: string) {
    return streamRepository.findById(id);
  },

  async onStreamEnded(streamId: string) {
    await publishStreamEvent('STREAM_ENDED', { streamId });
  },
};
