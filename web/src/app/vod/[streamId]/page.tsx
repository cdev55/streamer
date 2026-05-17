import { getStreamById } from '@/lib/api';
import { VideoPlayer } from '@/components/VideoPlayer';

interface PageProps {
  params: Promise<{ streamId: string }>;
}

export const dynamic = 'force-dynamic';

export default async function VodPage({ params }: PageProps) {
  const { streamId } = await params;

  let stream: Awaited<ReturnType<typeof getStreamById>> | null = null;
  try {
    stream = await getStreamById(streamId);
  } catch {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl bg-[#1F1F23] p-8 text-center">
          <p className="text-zinc-400">VOD not found</p>
        </div>
      </main>
    );
  }

  if (!stream.vodUrl) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl bg-[#1F1F23] p-8 text-center">
          <p className="text-zinc-400">VOD not available yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            The recording may still be processing.
          </p>
        </div>
      </main>
    );
  }

  const recordedDate = stream.createdAt
    ? new Date(stream.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="overflow-hidden rounded-xl bg-[#1F1F23]">
        <VideoPlayer src={stream.vodUrl} className="aspect-video" />
        <div className="p-4">
          <p className="font-medium">{stream.title}</p>
          <p className="text-sm text-zinc-400">
            @{stream.user?.username ?? 'streamer'}
          </p>
          {recordedDate && (
            <p className="text-sm text-zinc-500">
              Recorded: {recordedDate}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
