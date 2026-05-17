import Link from 'next/link';
import type { LiveStream } from '@/lib/api';

interface StreamCardProps {
  stream: LiveStream;
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link href={`/watch/${stream.streamId}`}>
      <div className="group overflow-hidden rounded-xl bg-[#1F1F23] transition hover:ring-1 hover:ring-[#3B82F6]/50">
        <div className="relative aspect-video w-full bg-zinc-900">
          <div className="absolute inset-0 flex items-center justify-center transition group-hover:scale-105">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#3B82F6]/50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="h-8 w-8"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold">
            LIVE
          </span>
        </div>
        <div className="p-3">
          <p className="truncate font-medium text-white" title={stream.title}>
            {stream.title}
          </p>
          <p className="text-sm text-zinc-400">
            @{stream.username ?? 'streamer'}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Live
          </p>
        </div>
      </div>
    </Link>
  );
}
