# Streamer Web – Frontend

Minimal MVP live streaming platform frontend built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- hls.js (video playback)

## Setup

1. Install dependencies: `npm install`
2. Create `.env.local` with:
   ```
   NEXT_PUBLIC_STREAM_API_URL=http://localhost:4002
   NEXT_PUBLIC_AUTH_API_URL=http://localhost:4001
   ```
3. Run the auth and stream backend services.
4. Start the dev server: `npm run dev`

## Routes

- `/` – Home (live streams)
- `/watch/[streamId]` – Watch live stream
- `/vod/[streamId]` – Watch VOD
- `/login` – Login
- `/signup` – Sign up
- `/dashboard` – Creator dashboard (auth required)
- `/dashboard/create` – Create new stream (auth required)
- `/go-live` – Stream key & OBS setup (auth required)
