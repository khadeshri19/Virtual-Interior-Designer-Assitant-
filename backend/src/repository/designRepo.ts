import { prisma } from '../config/db.js';
import { CreateDesignInput, UpdateDesignInput, DesignFilters } from '../types/design.js';
import { Prisma } from '@prisma/client';

export class DesignRepository {
    async create(data: CreateDesignInput) {
        return prisma.design.create({
            data: {
                ...data,
                generatedImages: [],
                status: 'pending',
            },
        });
    }

    async findById(id: string) {
        return prisma.design.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    async findByUserId(userId: string, limit: number = 50, offset: number = 0) {
        return prisma.design.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }

    async findMany(filters: DesignFilters, limit: number = 50, offset: number = 0) {
        const where: Prisma.DesignWhereInput = {};

        if (filters.userId) where.userId = filters.userId;
        if (filters.status) where.status = filters.status;
        if (filters.style) where.style = filters.style;
        if (filters.roomType) where.roomType = filters.roomType;

        return prisma.design.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }

    async update(id: string, data: UpdateDesignInput) {
        return prisma.design.update({
            where: { id },
            data,
        });
    }

    async updateStatus(id: string, status: string) {
        return prisma.design.update({
            where: { id },
            data: { status },
        });
    }

    async addGeneratedImage(id: string, imagePath: string) {
        const design = await this.findById(id);
        if (!design) return null;

        return prisma.design.update({
            where: { id },
            data: {
                generatedImages: [...design.generatedImages, imagePath],
            },
        });
    }

    async setGeneratedImages(id: string, images: string[]) {
        return prisma.design.update({
            where: { id },
            data: {
                generatedImages: images,
                status: 'completed',
            },
        });
    }

    async delete(id: string) {
        return prisma.design.delete({
            where: { id },
        });
    }

    async countByUser(userId: string) {
        return prisma.design.count({
            where: { userId },
        });
    }

    async getRecentDesigns(limit: number = 10) {
        return prisma.design.findMany({
            where: { status: 'completed' },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { user: { select: { name: true, avatar: true } } },
        });
    }
}

export const designRepository = new DesignRepository();
