export interface UploadedImage {
    filename: string;
    originalName: string;
    path: string;
    url: string;
    size: number;
    mimeType: string;
}
declare class ImageService {
    private ensureDirectoryExists;
    validateImage(file: Express.Multer.File): Promise<void>;
    saveUploadedImage(file: Express.Multer.File, userId: string): Promise<UploadedImage>;
    private resolveLocalPath;
    deleteImage(imagePath: string): Promise<boolean>;
    getImageBuffer(imagePath: string): Promise<Buffer>;
    copyImage(sourcePath: string, destDir: string): Promise<string>;
    generateThumbnail(imagePath: string, width?: number, height?: number): Promise<string>;
    downloadImage(url: string, subDir?: string): Promise<UploadedImage>;
    cleanupUserImages(userId: string): Promise<number>;
}
export declare const imageService: ImageService;
export {};
//# sourceMappingURL=imageService.d.ts.map