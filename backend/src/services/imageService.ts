import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
];

export interface UploadedImage {
    filename: string;
    originalName: string;
    path: string;
    url: string;
    size: number;
    mimeType: string;
}

// Ensure the root uploads directory exists at startup
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(err => logger.error('Failed to create root upload directory:', err));

class ImageService {
    private ensureDirectoryExists = async (dir: string): Promise<void> => {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    };

    async validateImage(file: Express.Multer.File): Promise<void> {
        if (!file) {
            throw new ValidationError('No image file provided');
        }

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new ValidationError(
                `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new ValidationError(
                `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
            );
        }
    }

    async saveUploadedImage(
        file: Express.Multer.File,
        userId: string
    ): Promise<UploadedImage> {
        await this.validateImage(file);

        const uploadDir = path.join(UPLOAD_DIR, 'originals', userId);
        await this.ensureDirectoryExists(uploadDir);

        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${uuidv4()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, file.buffer);

        const result: UploadedImage = {
            filename,
            originalName: file.originalname,
            path: filePath,
            url: `/uploads/originals/${userId}/${filename}`,
            size: file.size,
            mimeType: file.mimetype,
        };

        logger.info(`Image saved: ${filename} for user ${userId}`);
        return result;
    }

    private resolveLocalPath(imagePath: string): string {
        if (!imagePath) return '';

        // If it's already an absolute path (Windows or Unix style), return it
        if (path.isAbsolute(imagePath)) return imagePath;

        // If it starts with /uploads/, extract the relative part and join with absolute UPLOAD_DIR
        if (imagePath.includes('/uploads/')) {
            const relativePath = imagePath.split('/uploads/')[1];
            return path.join(UPLOAD_DIR, relativePath);
        }

        // If it's a relative path, assume it's relative to UPLOAD_DIR
        return path.join(UPLOAD_DIR, imagePath);
    }

    async deleteImage(imagePath: string): Promise<boolean> {
        try {
            const fullPath = this.resolveLocalPath(imagePath);
            if (!fullPath) return false;

            await fs.unlink(fullPath);
            logger.info(`Image deleted: ${fullPath}`);
            return true;
        } catch (error) {
            logger.error(`Failed to delete image: ${imagePath}`, error);
            return false;
        }
    }

    async getImageBuffer(imagePath: string): Promise<Buffer> {
        const fullPath = this.resolveLocalPath(imagePath);
        if (!fullPath) throw new ValidationError('Invalid image path');

        try {
            return await fs.readFile(fullPath);
        } catch (error) {
            logger.error(`Failed to read image buffer: ${fullPath}`, error);
            throw new ValidationError('Could not read image file');
        }
    }

    async copyImage(sourcePath: string, destDir: string): Promise<string> {
        await this.ensureDirectoryExists(destDir);

        const sourceBuffer = await this.getImageBuffer(sourcePath);
        const ext = path.extname(sourcePath) || '.jpg';
        const filename = `${uuidv4()}${ext}`;
        const destPath = path.join(destDir, filename);

        await fs.writeFile(destPath, sourceBuffer);
        return destPath;
    }

    async generateThumbnail(
        imagePath: string,
        width: number = 300,
        height: number = 200
    ): Promise<string> {
        // In production, use sharp library for image processing
        // For now, return the original path as a placeholder
        logger.info(`Thumbnail generation requested for ${imagePath} (${width}x${height})`);
        return imagePath;
    }

    async downloadImage(url: string, subDir: string = 'generated'): Promise<UploadedImage> {
        const maxRetries = 3;
        const timeout = 90000; // 90 seconds - Pollinations can take time to generate

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.info(`Downloading image (attempt ${attempt}/${maxRetries}): ${url.substring(0, 100)}...`);

                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    timeout: timeout,
                    headers: {
                        'User-Agent': 'VD-Assistant/1.0'
                    }
                });

                const buffer = Buffer.from(response.data);

                // Verify we got actual image data (at least 1KB)
                if (buffer.length < 1024) {
                    throw new Error('Downloaded file is too small to be a valid image');
                }

                const targetDir = path.join(UPLOAD_DIR, subDir);
                await this.ensureDirectoryExists(targetDir);

                // Detect extension from content-type or URL
                const contentType = response.headers['content-type'];
                let ext = '.jpg';
                if (contentType?.includes('png')) ext = '.png';
                else if (contentType?.includes('webp')) ext = '.webp';
                else if (url.includes('.png')) ext = '.png';
                else if (url.includes('.webp')) ext = '.webp';

                const filename = `${uuidv4()}${ext}`;
                const filePath = path.join(targetDir, filename);

                await fs.writeFile(filePath, buffer);

                logger.info(`Image saved successfully: ${filename} (${buffer.length} bytes)`);

                return {
                    filename,
                    originalName: 'generated_image.jpg',
                    path: filePath,
                    url: `/uploads/${subDir}/${filename}`,
                    size: buffer.length,
                    mimeType: 'image/jpeg',
                };
            } catch (error) {
                logger.error(`Download attempt ${attempt} failed:`, error);

                if (attempt === maxRetries) {
                    throw new Error(`Failed to download image after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }

                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            }
        }

        throw new Error('Failed to download image');
    }

    async cleanupUserImages(userId: string): Promise<number> {
        const userDir = path.join(UPLOAD_DIR, 'originals', userId);

        try {
            const files = await fs.readdir(userDir);
            for (const file of files) {
                await fs.unlink(path.join(userDir, file));
            }
            logger.info(`Cleaned up ${files.length} images for user ${userId}`);
            return files.length;
        } catch (error) {
            logger.error(`Cleanup failed for user ${userId}:`, error);
            return 0;
        }
    }
}

export const imageService = new ImageService();
