import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import path from 'path';
import fs from 'fs/promises';
import { s3Client, BUCKET } from '../config/s3';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const KEY_PREFIX = 'vod';

async function walkDir(dir: string, baseDir: string): Promise<{ localPath: string; key: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: { localPath: string; key: string }[] = [];
  for (const e of entries) {
    const localPath = path.join(dir, e.name);
    const relative = path.relative(baseDir, localPath);
    const key = relative.split(path.sep).join('/');
    if (e.isDirectory()) {
      files.push(...(await walkDir(localPath, baseDir)));
    } else {
      files.push({ localPath, key });
    }
  }
  return files;
}

/**
 * Upload entire directory to S3 at vod/{streamId}/.
 * Returns the public URL base (e.g. https://bucket.s3.region.amazonaws.com/vod/{streamId})
 * so that master.m3u8 URL is base + '/master.m3u8'.
 */
export async function uploadVodDirectory(
  streamId: string,
  localDir: string
): Promise<string> {
  const s3Prefix = `${KEY_PREFIX}/${streamId}`;
  const baseDir = localDir;
  const allFiles = await walkDir(localDir, baseDir);

  for (const { localPath, key } of allFiles) {
    const s3Key = key ? `${s3Prefix}/${key}` : s3Prefix;
    const body = createReadStream(localPath);
    const contentType = key.endsWith('.m3u8')
      ? 'application/vnd.apple.mpegurl'
      : key.endsWith('.ts')
        ? 'video/MP2T'
        : 'video/mp4';
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: body,
        ContentType: contentType,
      })
    );
  }

  const baseUrl = `https://${BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${s3Prefix}`;
  logger.info('[S3] Uploaded VOD directory', baseUrl);
  return baseUrl;
}
