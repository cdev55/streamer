import { viewerService } from './viewer.service';

const CLEANUP_INTERVAL_MS = 30_000;

let cleanupIntervalId: ReturnType<typeof setInterval> | null = null;

export function startViewerCleanup(): void {
  if (cleanupIntervalId) return;
  cleanupIntervalId = setInterval(() => {
    viewerService.runCleanup();
  }, CLEANUP_INTERVAL_MS);
  console.log('[ViewerCleanup] Started (every 30s)');
}
