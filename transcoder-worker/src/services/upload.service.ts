import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import path from 'path';
import { s3Client, BUCKET } from '../config/s3';

export const uploadService = {
  async upload(localPath: string, streamId: string): Promise<string> {
    const key = `transcoded/${streamId}${path.extname(localPath)}`;
    const body = createReadStream(localPath);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
      })
    );
    return key;
  },
};
