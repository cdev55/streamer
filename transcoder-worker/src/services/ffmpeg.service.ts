import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
// import ffmpegStatic from 'ffmpeg-static';
import { logger } from '../utils/logger';

// if (ffmpegStatic) {
//   ffmpeg.setFfmpegPath(ffmpegStatic);
// }

export async function transcodeTo720p(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-preset veryfast',
        '-vf scale=1280:720',
        '-c:a aac',
      ])
      .output(outputPath)
      .on('end', () => {
        logger.info('[FFmpeg] Transcode finished', outputPath);
        resolve();
      })
      .on('error', (err) => {
        logger.error('[FFmpeg]', err);
        reject(err);
      })
      .run();
  });
}
