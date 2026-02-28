import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';

const INPUT_DIR = process.env.INPUT_DIR || '/tmp/streams';
const OUTPUT_DIR = process.env.OUTPUT_DIR || '/tmp/transcoded';

export const ffmpegService = {
  async transcode(streamId: string): Promise<string> {
    const inputPath = path.join(INPUT_DIR, `${streamId}.ts`);
    const outputPath = path.join(OUTPUT_DIR, `${streamId}.mp4`);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  },
};
