import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { s3Client, BUCKET } from '../config/s3';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const KEY_PREFIX = 'vod';

export async function uploadVod(streamId: string, filePath: string): Promise<string> {
  const key = `${KEY_PREFIX}/${streamId}/final.mp4`;
  const body = createReadStream(filePath);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: 'video/mp4',
    })
  );
  const publicUrl = `https://${BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  logger.info('[S3] Uploaded VOD', publicUrl);
  return publicUrl;
}
