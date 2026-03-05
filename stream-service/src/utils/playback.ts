import { HLS_BASE_URL } from '../config/streaming';

export function generatePlaybackUrl(streamKey: string): string {
  return `${HLS_BASE_URL}/${streamKey}/index.m3u8`;
}
