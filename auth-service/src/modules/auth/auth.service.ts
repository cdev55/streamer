import { authRepository } from './auth.repository';
import { hashPassword, verifyPassword } from '../../utils/hash';
import { signToken } from '../../utils/jwt';
import type { RegisterInput, LoginInput } from './auth.types';

export const authService = {
  async register(input: RegisterInput) {
    const hashed = await hashPassword(input.password);
    const user = await authRepository.create({ ...input, password: hashed });
    const token = signToken({ userId: user.id });
    return { user: { id: user.id, email: user.email }, token };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user || !(await verifyPassword(input.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = signToken({ userId: user.id });
    return { user: { id: user.id, email: user.email }, token };
  },

  async getById(id: string) {
    return authRepository.findById(id);
  },
};
