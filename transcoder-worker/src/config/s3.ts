import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';
const endpoint = process.env.S3_ENDPOINT;

export const s3Client = new S3Client({
  region,
  ...(endpoint && { endpoint, forcePathStyle: true }),
});

export const BUCKET = process.env.S3_BUCKET || 'streams';
