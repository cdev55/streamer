import { prisma } from '../../config/db';
import type { CreateStreamInput } from './stream.types';

export const streamRepository = {
  create(data: { userId: string } & CreateStreamInput) {
    return prisma.stream.create({ data });
  },

  findByUserId(userId: string) {
    return prisma.stream.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.stream.findUnique({ where: { id } });
  },
};
