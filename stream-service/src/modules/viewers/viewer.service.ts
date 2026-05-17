import { redis } from '../../config/redis';

const VIEWER_TTL_SECONDS = 60;
const VIEWERS_KEY = (streamId: string) => `stream:${streamId}:viewers`;
const VIEWER_SESSION_KEY = (streamId: string, sessionId: string) =>
  `stream:${streamId}:viewer:${sessionId}`;
const VIEWER_SESSION_PATTERN = (streamId: string) => `stream:${streamId}:viewer:*`;

export const viewerService = {
  async join(streamId: string, sessionId: string): Promise<{ viewerCount: number }> {
    try {
      const sessionKey = VIEWER_SESSION_KEY(streamId, sessionId);
      const exists = await redis.exists(sessionKey);
      if (exists) {
        const count = await this.getViewerCount(streamId);
        return { viewerCount: count };
      }

      await redis.set(sessionKey, 'active', 'EX', VIEWER_TTL_SECONDS);
      const count = await redis.incr(VIEWERS_KEY(streamId));
      return { viewerCount: count };
    } catch (err) {
      console.error('[ViewerService] join failed:', err);
      throw err;
    }
  },

  async heartbeat(streamId: string, sessionId: string): Promise<{ viewerCount: number }> {
    try {
      const sessionKey = VIEWER_SESSION_KEY(streamId, sessionId);
      const exists = await redis.exists(sessionKey);
      if (!exists) {
        const count = await this.getViewerCount(streamId);
        return { viewerCount: count };
      }

      await redis.expire(sessionKey, VIEWER_TTL_SECONDS);
      const count = await this.getViewerCount(streamId);
      return { viewerCount: count };
    } catch (err) {
      console.error('[ViewerService] heartbeat failed:', err);
      throw err;
    }
  },

  async leave(streamId: string, sessionId: string): Promise<{ viewerCount: number }> {
    try {
      const sessionKey = VIEWER_SESSION_KEY(streamId, sessionId);
      const exists = await redis.exists(sessionKey);
      if (!exists) {
        const count = await this.getViewerCount(streamId);
        return { viewerCount: count };
      }

      await redis.del(sessionKey);
      const count = await redis.decr(VIEWERS_KEY(streamId));
      return { viewerCount: Math.max(0, count) };
    } catch (err) {
      console.error('[ViewerService] leave failed:', err);
      throw err;
    }
  },

  async getViewerCount(streamId: string): Promise<number> {
    try {
      const val = await redis.get(VIEWERS_KEY(streamId));
      const count = parseInt(val ?? '0', 10);
      return isNaN(count) ? 0 : Math.max(0, count);
    } catch (err) {
      console.error('[ViewerService] getViewerCount failed:', err);
      return 0;
    }
  },

  async runCleanup(): Promise<void> {
    try {
      const keys = await redis.keys('stream:*:viewer:*');
      const streamIds = new Set<string>();
      for (const key of keys) {
        const parts = key.split(':');
        if (parts[0] === 'stream' && parts[1]) {
          streamIds.add(parts[1]);
        }
      }

      for (const streamId of streamIds) {
        const pattern = VIEWER_SESSION_PATTERN(streamId);
        const viewerKeys = await redis.keys(pattern);
        const actualCount = viewerKeys.length;
        await redis.set(VIEWERS_KEY(streamId), String(actualCount));
      }
    } catch (err) {
      console.error('[ViewerService] runCleanup failed:', err);
    }
  },
};
