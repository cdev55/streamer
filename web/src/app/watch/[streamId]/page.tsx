import Link from 'next/link';
import { getStreamPlayback, getStreamById } from '@/lib/api';
import { WatchStreamContent } from '@/components/WatchStreamContent';

interface PageProps {
  params: Promise<{ streamId: string }>;
}

export const dynamic = 'force-dynamic';

export default async function WatchPage({ params }: PageProps) {
  const { streamId } = await params;
  let playback: Awaited<ReturnType<typeof getStreamPlayback>> | null = null;
  let stream: Awaited<ReturnType<typeof getStreamById>> | null = null;

  try {
    [playback, stream] = await Promise.all([
      getStreamPlayback(streamId),
      getStreamById(streamId),
    ]);
  } catch {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl bg-[#1F1F23] p-8 text-center">
          <p className="text-zinc-400">Stream not found</p>
        </div>
      </main>
    );
  }

  if (!playback.live) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl bg-[#1F1F23] p-8">
          <div className="aspect-video rounded-lg bg-zinc-900 flex items-center justify-center">
            <p className="text-zinc-400">This stream is offline</p>
          </div>
          <div className="mt-4">
            <p className="font-medium">{stream?.title ?? 'Stream'}</p>
            <p className="text-sm text-zinc-400">
              @{stream?.user?.username ?? 'streamer'}
            </p>
            {stream?.vodUrl && (
              <Link
                href={`/vod/${streamId}`}
                className="mt-3 inline-block text-[#3B82F6] hover:underline"
              >
                Watch latest VOD
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <WatchStreamContent
        streamId={streamId}
        playbackUrl={playback.playbackUrl!}
        title={stream?.title ?? 'Stream'}
        username={stream?.user?.username ?? 'streamer'}
      />
    </main>
  );
}
