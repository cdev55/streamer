import { getLiveStreams } from '@/lib/api';
import { StreamCard } from '@/components/StreamCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let streams: Awaited<ReturnType<typeof getLiveStreams>> = [];
  try {
    streams = await getLiveStreams();
  } catch {
    streams = [];
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Live Streams</h1>
      {streams.length === 0 ? (
        <div className="rounded-xl bg-[#1F1F23] p-12 text-center">
          <p className="text-zinc-400">No live streams at the moment.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Check back later or go live yourself!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {streams.map((stream) => (
            <StreamCard key={stream.streamId} stream={stream} />
          ))}
        </div>
      )}
    </main>
  );
}
