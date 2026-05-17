'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { setToken } from '@/lib/auth';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { login, signup } = await import('@/lib/api');
      const result =
        mode === 'login'
          ? await login(email, password)
          : await signup(username, email, password);
      setToken(result.accessToken);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-[#1F1F23] bg-[#1F1F23]">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Enter your credentials to sign in'
            : 'Create an account to start streaming'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-400">
              {error}
            </p>
          )}
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                className="bg-zinc-900 border-zinc-700"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Loading...'
              : mode === 'login'
                ? 'Login'
                : 'Create Account'}
          </Button>
          {mode === 'login' ? (
            <p className="text-center text-sm text-zinc-400">
              Need an account?{' '}
              <Link href="/signup" className="text-[#3B82F6] hover:underline">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#3B82F6] hover:underline">
                Login
              </Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
