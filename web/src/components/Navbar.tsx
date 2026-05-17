'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getToken } from '@/lib/auth';
import { getMe, type User } from '@/lib/api';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe(token)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0F0F10]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="h-4 w-4"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span>Streamer</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/go-live"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Go Live
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Dashboard
          </Link>
          {loading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-zinc-800" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-medium text-white"
            >
              {user.username.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login / Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
