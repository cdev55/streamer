const TOKEN_KEY = 'streamer_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=2592000; samesite=lax`;
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}
