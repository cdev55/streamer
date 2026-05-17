'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Stream } from '@/lib/api';

interface DashboardTableProps {
  streams: Stream[];
}

export function DashboardTable({ streams }: DashboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#1F1F23]">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <h2 className="text-lg font-semibold">Your Streams</h2>
        <Link href="/dashboard/create">
          <Button>Create New Stream</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {streams.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No streams yet. Create your first stream to get started.
                </td>
              </tr>
            ) : (
              streams.map((stream) => (
                <tr
                  key={stream.id}
                  className="border-b border-zinc-800/50 transition hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{stream.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                        stream.isLive
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-zinc-700 text-zinc-400'
                      }`}
                    >
                      {stream.isLive ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/watch/${stream.id}`}>
                      <Button variant="link" size="sm">
                        View Stream
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
