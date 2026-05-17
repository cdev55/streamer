'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getStreamKey, regenerateStreamKey } from '@/lib/api';
import { getToken } from '@/lib/auth';

export function StreamKeyPanel() {
  const [streamKey, setStreamKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = typeof window !== 'undefined' ? getToken() : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getStreamKey(token)
      .then(({ streamKey: key }) => setStreamKey(key))
      .catch(() => setStreamKey(''))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(streamKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!token) return;
    setRegenerating(true);
    try {
      const { streamKey: newKey } = await regenerateStreamKey(token);
      setStreamKey(newKey);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1F1F23] bg-[#1F1F23]">
        <CardHeader>
          <CardTitle>Stream Key</CardTitle>
          <CardDescription>
            Use this key in OBS or any RTMP streaming software
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={loading ? 'Loading...' : streamKey}
              readOnly
              type="password"
              className="font-mono bg-zinc-900 border-zinc-700"
            />
            <Button onClick={handleCopy} disabled={!streamKey || loading}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={!streamKey || regenerating}
            >
              {regenerating ? '...' : 'Regenerate'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-[#1F1F23] bg-[#1F1F23]">
        <CardHeader>
          <CardTitle>OBS Setup Instructions</CardTitle>
          <CardDescription>
            Configure OBS Studio to stream to this platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-zinc-400">Server URL</p>
            <p className="font-mono text-sm text-white">
              rtmp://yourdomain/live
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Stream Key</p>
            <p className="text-sm text-zinc-300">
              Paste the stream key from above into the Stream Key field in OBS.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
