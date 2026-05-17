import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { StreamKeyPanel } from '@/components/StreamKeyPanel';

export default async function GoLivePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('streamer_token')?.value;
  if (!token) redirect('/login');

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Go Live</h1>
      <StreamKeyPanel />
    </main>
  );
}
