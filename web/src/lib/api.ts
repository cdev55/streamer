const STREAM_API = process.env.NEXT_PUBLIC_STREAM_API_URL || 'http://localhost:4002';
const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:4001';

async function fetchWithAuth(
  url: string,
  options: RequestInit & { token?: string | null } = {}
) {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...fetchOptions, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || err.error || res.statusText);
  }
  return res.json();
}

export interface LiveStream {
  streamId: string;
  title: string;
  playbackUrl: string;
  username?: string;
}

export interface StreamPlayback {
  live: boolean;
  playbackUrl?: string;
}

export interface Stream {
  id: string;
  title: string;
  description?: string | null;
  isLive: boolean;
  vodUrl?: string;
  user?: { id: string; username: string };
  createdAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  streamKey: string;
}

export async function getLiveStreams(): Promise<LiveStream[]> {
  const res = await fetch(`${STREAM_API}/streams/live`,{cache:'no-store'});
  if (!res.ok) throw new Error('Failed to fetch live streams');
  return res.json();
}

export async function getStreamPlayback(streamId: string): Promise<StreamPlayback> {
  const res = await fetch(`${STREAM_API}/streams/${streamId}/playback`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Stream not found');
  return res.json();
}

export async function getStreamById(streamId: string): Promise<Stream> {
  const res = await fetch(`${STREAM_API}/streams/${streamId}`);
  if (!res.ok) throw new Error('Stream not found');
  return res.json();
}

export async function login(email: string, password: string): Promise<{ accessToken: string }> {
  return fetchWithAuth(`${AUTH_API}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  return fetchWithAuth(`${AUTH_API}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export async function getMe(token: string): Promise<User> {
  return fetchWithAuth(`${AUTH_API}/auth/me`, { token });
}

export async function getUserStreams(token: string): Promise<Stream[]> {
  return fetchWithAuth(`${STREAM_API}/streams/me`, { token });
}

export async function getStreamKey(token: string): Promise<{ streamKey: string }> {
  const user = await getMe(token);
  return { streamKey: user.streamKey };
}

export async function regenerateStreamKey(token: string): Promise<{ streamKey: string }> {
  return fetchWithAuth(`${AUTH_API}/auth/stream-key`, {
    method: 'POST',
    token,
  });
}

export async function createStream(
  token: string,
  data: { title: string; description?: string }
): Promise<Stream> {
  return fetchWithAuth(`${STREAM_API}/streams`, {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export async function viewerJoin(
  streamId: string,
  sessionId: string
): Promise<{ viewerCount: number }> {
  const res = await fetch(`${STREAM_API}/streams/${streamId}/viewer-join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error('Failed to join stream');
  return res.json();
}

export async function viewerHeartbeat(
  streamId: string,
  sessionId: string
): Promise<{ viewerCount: number }> {
  const res = await fetch(`${STREAM_API}/streams/${streamId}/viewer-heartbeat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error('Failed to send heartbeat');
  return res.json();
}

export async function viewerLeave(
  streamId: string,
  sessionId: string
): Promise<{ viewerCount: number }> {
  const res = await fetch(`${STREAM_API}/streams/${streamId}/viewer-leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error('Failed to leave stream');
  return res.json();
}

export async function getViewerCount(streamId: string): Promise<{ viewerCount: number }> {
  const res = await fetch(`${STREAM_API}/streams/${streamId}/viewer-count`);
  if (!res.ok) throw new Error('Failed to get viewer count');
  return res.json();
}
