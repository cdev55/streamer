'use client';

import { useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ViewerTracker } from '@/components/ViewerTracker';

interface WatchStreamContentProps {
  streamId: string;
  playbackUrl: string;
  title: string;
  username: string;
}

export function WatchStreamContent({
  streamId,
  playbackUrl,
  title,
  username,
}: WatchStreamContentProps) {
  const [viewerCount, setViewerCount] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl bg-[#1F1F23]">
      <ViewerTracker streamId={streamId} onViewerCountChange={setViewerCount} />
      <VideoPlayer src={playbackUrl} className="aspect-video" />
      <div className="p-4">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-400">@{username}</p>
        {viewerCount !== null && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {viewerCount} {viewerCount === 1 ? 'Viewer' : 'Viewers'}
          </p>
        )}
      </div>
    </div>
  );
}
