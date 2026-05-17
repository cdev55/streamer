import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserStreams } from '@/lib/api';
import { DashboardTable } from '@/components/DashboardTable';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('streamer_token')?.value;
  if (!token) redirect('/login');

  let streams: Awaited<ReturnType<typeof getUserStreams>> = [];
  try {
    streams = await getUserStreams(token);
  } catch {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Creator Dashboard</h1>
      <DashboardTable streams={streams} />
    </main>
  );
}
