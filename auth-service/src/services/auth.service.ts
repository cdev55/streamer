import { db } from '@streamer/database';
import { hashPassword, verifyPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { generateStreamKey } from '../utils/streamKey';

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async signup(input: SignupInput) {
    const passwordHash = await hashPassword(input.password);
    const streamKey = generateStreamKey();

    const user = await db.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
        streamKey,
      },
    });

    const accessToken = generateToken(user.id);
    return { accessToken };
  },

  async login(input: LoginInput) {
    const user = await db.user.findUnique({ where: { email: input.email } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = generateToken(user.id);
    return { accessToken };
  },

  async getMe(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        streamKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  },

  async refreshStreamKey(userId: string) {
    const streamKey = generateStreamKey();
    const user = await db.user.update({
      where: { id: userId },
      data: { streamKey },
    });
    return { streamKey: user.streamKey };
  },
};
