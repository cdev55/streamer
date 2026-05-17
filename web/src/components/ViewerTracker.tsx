'use client';

import { useEffect, useRef } from 'react';
import {
  viewerJoin,
  viewerHeartbeat,
  viewerLeave,
} from '@/lib/api';

const HEARTBEAT_INTERVAL_MS = 30_000;

const STREAM_API = process.env.NEXT_PUBLIC_STREAM_API_URL || 'http://localhost:4002';

function sendViewerLeaveBeacon(streamId: string, sessionId: string): void {
  const url = `${STREAM_API}/streams/${streamId}/viewer-leave`;
  const blob = new Blob([JSON.stringify({ sessionId })], {
    type: 'application/json',
  });
  navigator.sendBeacon(url, blob);
}

interface ViewerTrackerProps {
  streamId: string;
  onViewerCountChange?: (count: number) => void;
}

export function ViewerTracker({ streamId, onViewerCountChange }: ViewerTrackerProps) {
  const sessionIdRef = useRef<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const sessionId = crypto.randomUUID();
    sessionIdRef.current = sessionId;

    const leave = () => {
      if (sessionIdRef.current) {
        viewerLeave(streamId, sessionIdRef.current).catch(() => {});
        sessionIdRef.current = null;
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };

    viewerJoin(streamId, sessionId)
      .then(({ viewerCount }) => onViewerCountChange?.(viewerCount))
      .catch(() => {});

    heartbeatRef.current = setInterval(() => {
      if (!sessionIdRef.current) return;
      viewerHeartbeat(streamId, sessionIdRef.current)
        .then(({ viewerCount }) => onViewerCountChange?.(viewerCount))
        .catch(() => {});
    }, HEARTBEAT_INTERVAL_MS);

    const handlePageHide = () => sendViewerLeaveBeacon(streamId, sessionId);

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      leave();
    };
  }, [streamId, onViewerCountChange]);

  return null;
}
