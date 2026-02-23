import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function checkR2() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;

    console.log('--- R2 Configuration Check ---');
    console.log('Account ID:', accountId ? 'Present' : 'Missing');
    console.log('Access Key ID:', accessKeyId ? `Present (Length: ${accessKeyId.length})` : 'Missing');
    console.log('Secret Access Key:', secretAccessKey ? `Present (Length: ${secretAccessKey.length})` : 'Missing');
    console.log('Bucket Name:', bucketName);
    console.log('------------------------------');

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        console.error('CRITICAL: Missing required environment variables.');
        process.exit(1);
    }

    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    });

    try {
        console.log(`Attempting to list objects in bucket "${bucketName}"...`);
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 1,
        });

        const response = await client.send(command);
        console.log('SUCCESS: Connection to R2 established.');
        console.log('Bucket is accessible.');
        if (response.Contents) {
            console.log(`Found ${response.Contents.length} objects (capped at 1).`);
        } else {
            console.log('Bucket is empty.');
        }
    } catch (error) {
        console.error('ERROR: Failed to connect to R2.');
        if (error instanceof Error) {
            console.error('Error Name:', error.name);
            console.error('Error Message:', error.message);
            // @ts-ignore
            if (error.$metadata) {
                // @ts-ignore
                console.error('HTTP Status:', error.$metadata.httpStatusCode);
            }
        } else {
            console.error(error);
        }
        process.exit(1);
    }
}

checkR2();
