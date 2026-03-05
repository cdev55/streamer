export const logger = {
  info(...args: unknown[]) {
    console.log('[transcoder-worker]', ...args);
  },
  error(...args: unknown[]) {
    console.error('[transcoder-worker]', ...args);
  },
};
