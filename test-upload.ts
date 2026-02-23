import { uploadImage } from './src/lib/r2/upload';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
    try {
        const filePath = join(process.cwd(), 'public', 'favicon.ico');
        const buffer = readFileSync(filePath);
        console.log('Testing upload...', { R2_BUCKET_NAME: process.env.R2_BUCKET_NAME });
        const result = await uploadImage(buffer, {
            filename: 'test.ico',
            contentType: 'image/x-icon',
            folder: 'test'
        });
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
