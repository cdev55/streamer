import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

const HLS_TIME = 6;
const PRESET = 'veryfast';

/**
 * Generate ABR HLS ladder (1080p, 720p, 360p) from a single input.
 * Decode once, scale to three renditions, output HLS with .ts segments.
 * Output: outputDir/master.m3u8, outputDir/1080p/, outputDir/720p/, outputDir/360p/
 */
export async function generateAbrHls(
  inputPath: string,
  outputDir: string
): Promise<void> {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.join(outputDir, '0'), { recursive: true });
  await fs.mkdir(path.join(outputDir, '1'), { recursive: true });
  await fs.mkdir(path.join(outputDir, '2'), { recursive: true });

  const segmentPattern = path.join(outputDir, '%v', 'segment_%03d.ts');
  const playlistPattern = path.join(outputDir, '%v', 'index.m3u8');

  const args = [
    '-i',
    inputPath,
    '-filter_complex',
    [
      '[0:v]split=3[v1][v2][v3];',
      '[v1]scale=1920:1080[v1out];',
      '[v2]scale=1280:720[v2out];',
      '[v3]scale=640:360[v3out]',
    ].join(' '),
    '-map',
    '[v1out]',
    '-map',
    '0:a',
    '-map',
    '[v2out]',
    '-map',
    '0:a',
    '-map',
    '[v3out]',
    '-map',
    '0:a',
    '-c:v',
    'libx264',
    '-preset',
    PRESET,
    '-c:a',
    'aac',
    '-var_stream_map',
    'v:0,a:0 v:1,a:1 v:2,a:2',
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    String(HLS_TIME),
    '-hls_playlist_type',
    'vod',
    '-hls_segment_filename',
    segmentPattern,
    playlistPattern,
  ];

  await new Promise<void>((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr?.on('data', (d) => (stderr += d.toString()));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`));
    });
    proc.on('error', reject);
  });

  // Rename 0 -> 1080p, 1 -> 720p, 2 -> 360p
  const renames = [
    [path.join(outputDir, '0'), path.join(outputDir, '1080p')],
    [path.join(outputDir, '1'), path.join(outputDir, '720p')],
    [path.join(outputDir, '2'), path.join(outputDir, '360p')],
  ];
  for (const [from, to] of renames) {
    try {
      await fs.rename(from, to);
    } catch (e) {
      logger.error('[ABR] Rename failed', from, to, e);
      throw e;
    }
  }

  // Write master.m3u8 referencing 1080p, 720p, 360p
  const masterContent = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=6000000,RESOLUTION=1920x1080
1080p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
`;
  await fs.writeFile(path.join(outputDir, 'master.m3u8'), masterContent, 'utf8');
}
