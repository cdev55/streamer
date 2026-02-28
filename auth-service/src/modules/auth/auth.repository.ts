import { prisma } from '../../config/db';
import type { CreateUserInput } from './auth.types';

export const authRepository = {
  create(data: CreateUserInput & { password: string }) {
    return prisma.user.create({ data });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, createdAt: true } });
  },
};
