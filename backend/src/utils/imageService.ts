import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
}

const STORAGE_TYPE = process.env.IMAGE_STORAGE_TYPE || 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/products';
const MAX_IMAGE_SIZE = parseInt(process.env.MAX_IMAGE_SIZE || '5242880');
const IMAGE_QUALITY = parseInt(process.env.IMAGE_QUALITY || '90');

const THUMBNAIL_WIDTH = parseInt(process.env.THUMBNAIL_WIDTH || '150');
const THUMBNAIL_HEIGHT = parseInt(process.env.THUMBNAIL_HEIGHT || '150');
const MEDIUM_WIDTH = parseInt(process.env.MEDIUM_WIDTH || '500');
const MEDIUM_HEIGHT = parseInt(process.env.MEDIUM_HEIGHT || '500');
const LARGE_WIDTH = parseInt(process.env.LARGE_WIDTH || '1000');
const LARGE_HEIGHT = parseInt(process.env.LARGE_HEIGHT || '1000');

// Initialize S3 client if using S3 storage
let s3Client: S3Client | null = null;
if (STORAGE_TYPE === 's3') {
  s3Client = new S3Client({
    region: process.env.AWS_S3_REGION || 'eu-central-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
}

/**
 * Validate image file
 */
export const validateImage = (file: Express.Multer.File): void => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
  }
  
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`File too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
  }
};

/**
 * Process image with Sharp
 */
export const processImage = async (
  buffer: Buffer,
  width: number,
  height: number,
  format: 'jpeg' | 'webp' = 'jpeg'
): Promise<ProcessedImage> => {
  const processed = await sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFormat(format, { quality: IMAGE_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: processed.data,
    width: processed.info.width,
    height: processed.info.height,
    format: processed.info.format,
  };
};

/**
 * Get image metadata
 */
export const getImageMetadata = async (buffer: Buffer): Promise<{ width: number; height: number; format: string }> => {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
  };
};

/**
 * Create directory if it doesn't exist
 */
const ensureDirectory = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Save image to local storage
 */
const saveToLocal = async (
  buffer: Buffer,
  productId: string,
  fileName: string,
  type: 'original' | 'thumbnail' | 'medium' | 'large' | 'webp'
): Promise<string> => {
  const dir = path.join(UPLOAD_DIR, productId, type);
  ensureDirectory(dir);
  
  const filePath = path.join(dir, fileName);
  await fs.promises.writeFile(filePath, buffer);
  
  return `/uploads/products/${productId}/${type}/${fileName}`;
};

/**
 * Save image to S3
 */
const saveToS3 = async (
  buffer: Buffer,
  productId: string,
  fileName: string,
  type: 'original' | 'thumbnail' | 'medium' | 'large' | 'webp',
  mimeType: string
): Promise<string> => {
  if (!s3Client) {
    throw new Error('S3 client not initialized');
  }

  const key = `products/${productId}/${type}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ServerSideEncryption: 'AES256',
  });

  await s3Client.send(command);

  const cdnUrl = process.env.AWS_S3_CDN_URL;
  if (cdnUrl) {
    return `${cdnUrl}/${key}`;
  }

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
};

/**
 * Upload and process image
 */
export const uploadImage = async (
  file: Express.Multer.File,
  productId: string
): Promise<{
  originalUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  webpUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  s3Key?: string;
}> => {
  validateImage(file);

  const metadata = await getImageMetadata(file.buffer);
  const baseFileName = randomUUID();
  const fileName = `${baseFileName}.jpg`;
  const webpFileName = `${baseFileName}.webp`;

  // Process images in different sizes
  const original = await processImage(file.buffer, metadata.width, metadata.height, 'jpeg');
  const thumbnail = await processImage(file.buffer, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, 'jpeg');
  const medium = await processImage(file.buffer, MEDIUM_WIDTH, MEDIUM_HEIGHT, 'jpeg');
  const large = await processImage(file.buffer, LARGE_WIDTH, LARGE_HEIGHT, 'jpeg');
  const webp = await processImage(file.buffer, LARGE_WIDTH, LARGE_HEIGHT, 'webp');

  let originalUrl: string;
  let thumbnailUrl: string;
  let mediumUrl: string;
  let largeUrl: string;
  let webpUrl: string;
  let s3Key: string | undefined;

  if (STORAGE_TYPE === 's3') {
    originalUrl = await saveToS3(original.buffer, productId, fileName, 'original', 'image/jpeg');
    thumbnailUrl = await saveToS3(thumbnail.buffer, productId, fileName, 'thumbnail', 'image/jpeg');
    mediumUrl = await saveToS3(medium.buffer, productId, fileName, 'medium', 'image/jpeg');
    largeUrl = await saveToS3(large.buffer, productId, fileName, 'large', 'image/jpeg');
    webpUrl = await saveToS3(webp.buffer, productId, webpFileName, 'webp', 'image/webp');
    s3Key = `products/${productId}`;
  } else {
    originalUrl = await saveToLocal(original.buffer, productId, fileName, 'original');
    thumbnailUrl = await saveToLocal(thumbnail.buffer, productId, fileName, 'thumbnail');
    mediumUrl = await saveToLocal(medium.buffer, productId, fileName, 'medium');
    largeUrl = await saveToLocal(large.buffer, productId, fileName, 'large');
    webpUrl = await saveToLocal(webp.buffer, productId, webpFileName, 'webp');
  }

  return {
    originalUrl,
    thumbnailUrl,
    mediumUrl,
    largeUrl,
    webpUrl,
    fileName,
    fileSize: file.size,
    mimeType: file.mimetype,
    width: metadata.width,
    height: metadata.height,
    s3Key,
  };
};

/**
 * Delete image from local storage
 */
const deleteFromLocal = async (productId: string, fileName: string): Promise<void> => {
  const types = ['original', 'thumbnail', 'medium', 'large', 'webp'];
  
  for (const type of types) {
    const filePath = path.join(UPLOAD_DIR, productId, type, fileName);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
};

/**
 * Delete image from S3
 */
const deleteFromS3 = async (productId: string, fileName: string): Promise<void> => {
  if (!s3Client) {
    throw new Error('S3 client not initialized');
  }

  const types = ['original', 'thumbnail', 'medium', 'large', 'webp'];
  
  for (const type of types) {
    const key = `products/${productId}/${type}/${fileName}`;
    
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });
      await s3Client.send(command);
    } catch (error) {
      console.error(`Failed to delete S3 object ${key}:`, error);
    }
  }
};

/**
 * Delete image
 */
export const deleteImage = async (
  productId: string,
  fileName: string,
  storageType: string
): Promise<void> => {
  if (storageType === 's3') {
    await deleteFromS3(productId, fileName);
  } else {
    await deleteFromLocal(productId, fileName);
  }
};
