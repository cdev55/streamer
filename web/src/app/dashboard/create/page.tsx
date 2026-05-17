'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createStream } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function CreateStreamPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await createStream(token, { title, description });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create stream');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-4 inline-block text-sm text-zinc-400 hover:text-white"
      >
        ← Back to Dashboard
      </Link>
      <Card className="border-[#1F1F23] bg-[#1F1F23]">
        <CardHeader>
          <CardTitle>Create New Stream</CardTitle>
          <CardDescription>
            Add a title and optional description for your stream
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-400">
                {error}
              </p>
            )}
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome stream"
                required
                className="bg-zinc-900 border-zinc-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                Description (optional)
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's your stream about?"
                className="bg-zinc-900 border-zinc-700"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Stream'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
