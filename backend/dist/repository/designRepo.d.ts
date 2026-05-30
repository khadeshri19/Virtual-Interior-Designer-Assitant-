import { CreateDesignInput, UpdateDesignInput, DesignFilters } from '../types/design.js';
import { Prisma } from '@prisma/client';
export declare class DesignRepository {
    create(data: CreateDesignInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }>;
    findById(id: string): Promise<({
        user: {
            name: string | null;
            id: string;
            email: string;
            password: string;
            avatar: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }) | null>;
    findByUserId(userId: string, limit?: number, offset?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }[]>;
    findMany(filters: DesignFilters, limit?: number, offset?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }[]>;
    update(id: string, data: UpdateDesignInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }>;
    addGeneratedImage(id: string, imagePath: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    } | null>;
    setGeneratedImages(id: string, images: string[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    }>;
    countByUser(userId: string): Promise<number>;
    getRecentDesigns(limit?: number): Promise<({
        user: {
            name: string | null;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalImage: string;
        generatedImages: string[];
        style: string;
        roomType: string;
        budget: number | null;
        dimensions: string | null;
        status: string;
        prompt: string | null;
        metadata: Prisma.JsonValue | null;
    })[]>;
}
export declare const designRepository: DesignRepository;
//# sourceMappingURL=designRepo.d.ts.map