# Step 6: Cloudflare R2 Client Setup

> **Phase:** 0 (Foundation & Setup)
> **Focus:** Configure Cloudflare R2 for image storage
> **Estimated Time:** 20-30 minutes

---

## Context

This is Step 6 of the Sam's Walls project implementation. R2 will store all wallpaper images with CDN delivery.

**Prerequisites:** 
- Steps 1-5 completed
- R2 credentials ready (account ID, access key, secret key, bucket name)

**Documentation Reference:**
- Architecture: `MD/ARCHITECTURE.md` (Section 6 - Image Storage & Delivery)

---

## Tasks

### Task 6.1: Install R2/S3 Client Package

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Note:** Cloudflare R2 is S3-compatible, so we use AWS SDK.

---

### Task 6.2: Create R2 Client

Create `src/lib/r2/client.ts`:

```typescript
import { S3Client } from '@aws-sdk/client-s3';

export function createR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
```

---

### Task 6.3: Create Upload Helper

Create `src/lib/r2/upload.ts`:

```typescript
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './client';
import { randomUUID } from 'crypto';

export interface UploadResult {
  key: string;
  url: string;
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
  const key = options.folder 
    ? `${options.folder}/${randomUUID()}-${options.filename || 'image'}`
    : `${randomUUID()}-${options.filename || 'image'}`;

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: options.contentType,
    })
  );

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
    fileSize: file.length,
  };
}
```

---

### Task 6.4: Create R2 Index

Create `src/lib/r2/index.ts`:

```typescript
export { createR2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './client';
export { uploadImage } from './upload';
export type { UploadResult } from './upload';
```

---

### Task 6.5: Update Environment Variables

Ensure `.env.local` has your R2 credentials:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=samswalls-images
R2_PUBLIC_URL=https://your-bucket-url
```

**Your credentials should be:**
- `R2_ACCOUNT_ID`: From Cloudflare dashboard
- `R2_ACCESS_KEY_ID`: From R2 API tokens
- `R2_SECRET_ACCESS_KEY`: From R2 API tokens
- `R2_BUCKET_NAME`: `samswalls-images` (or your bucket name)
- `R2_PUBLIC_URL`: Your bucket's public URL

---

### Task 6.6: Create Types for Image Upload

Add to `src/types/index.ts`:

```typescript
// Image upload types
export interface ImageUpload {
  file: File;
  preview?: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  thumbnail_url: string | null;
  width: number;
  height: number;
  file_size: number;
}
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] AWS SDK packages installed
- [ ] R2 client created with correct endpoint
- [ ] Upload helper function created
- [ ] Environment variables configured
- [ ] Types added for image upload

---

## Summary (Write after completing tasks)

> **Instructions:** After completing all tasks above, write a summary below of what was done, any issues encountered, and any decisions made. This summary will be reviewed by Bunny (Project Architect).

### Summary

**What was completed:**
- Task 6.1: Installed `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` (109 packages added)
- Task 6.2: Created R2 client at `src/lib/r2/client.ts` with S3-compatible configuration
- Task 6.3: Created upload helper at `src/lib/r2/upload.ts` with `uploadImage` function
- Task 6.4: Created R2 index at `src/lib/r2/index.ts` for clean exports
- Task 6.5: Environment variables already configured by user (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL)
- Task 6.6: Added `ImageUpload` and `UploadedImage` types to `src/types/index.ts`

**Files created:**
- `src/lib/r2/client.ts` - S3 client configured for Cloudflare R2
- `src/lib/r2/upload.ts` - Image upload function with UUID-based key generation
- `src/lib/r2/index.ts` - Clean exports for R2 utilities

**Any issues encountered:**
- None - all tasks completed successfully

**Decisions made:**
- Used AWS SDK v3 for S3 compatibility with Cloudflare R2
- Used `region: 'auto'` as required for R2
- Used UUID-based filenames to prevent collisions

**Ready for next step:** Yes

---
