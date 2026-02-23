import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './client';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export interface UploadResult {
  key: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  fileSize: number;
}

export async function uploadImage(
  file: Buffer,
  options: {
    filename?: string;
    contentType: string;
    folder?: string;
  }
): Promise<UploadResult> {
  const client = createR2Client();
  const uuid = randomUUID();

  // Extract file extension or use a default
  const getExtension = (name: string, contentType: string) => {
    if (name && name.includes('.')) return name.split('.').pop()?.toLowerCase() || '';
    if (contentType === 'image/jpeg') return 'jpg';
    if (contentType === 'image/png') return 'png';
    if (contentType === 'image/webp') return 'webp';
    if (contentType === 'image/gif') return 'gif';
    return '';
  };

  const ext = getExtension(options.filename || '', options.contentType);
  const baseName = options.filename ? options.filename.replace(/\.[^/.]+$/, '') : 'image';

  // Clean names to be URL safe
  const cleanBaseName = baseName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

  const key = options.folder
    ? `${options.folder}/${uuid}-${cleanBaseName}${ext ? '.' + ext : ''}`
    : `${uuid}-${cleanBaseName}${ext ? '.' + ext : ''}`;

  // Process with sharp
  const image = sharp(file);
  const metadata = await image.metadata();

  // Generate thumbnail (webp, max 800px width/height)
  const thumbnailBuffer = await image
    .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const thumbKey = options.folder
    ? `${options.folder}/thumbnails/${uuid}-${cleanBaseName}.webp`
    : `thumbnails/${uuid}-${cleanBaseName}.webp`;

  // Upload original
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: options.contentType,
    })
  );

  // Upload thumbnail
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: thumbKey,
      Body: thumbnailBuffer,
      ContentType: 'image/webp',
    })
  );

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
    thumbnailUrl: `${R2_PUBLIC_URL}/${thumbKey}`,
    width: metadata.width,
    height: metadata.height,
    fileSize: file.length,
  };
}
