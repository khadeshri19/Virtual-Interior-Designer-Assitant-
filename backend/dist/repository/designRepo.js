import { prisma } from '../config/db.js';
export class DesignRepository {
    async create(data) {
        return prisma.design.create({
            data: {
                ...data,
                generatedImages: [],
                status: 'pending',
            },
        });
    }
    async findById(id) {
        return prisma.design.findUnique({
            where: { id },
            include: { user: true },
        });
    }
    async findByUserId(userId, limit = 50, offset = 0) {
        return prisma.design.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async findMany(filters, limit = 50, offset = 0) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.status)
            where.status = filters.status;
        if (filters.style)
            where.style = filters.style;
        if (filters.roomType)
            where.roomType = filters.roomType;
        return prisma.design.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async update(id, data) {
        return prisma.design.update({
            where: { id },
            data,
        });
    }
    async updateStatus(id, status) {
        return prisma.design.update({
            where: { id },
            data: { status },
        });
    }
    async addGeneratedImage(id, imagePath) {
        const design = await this.findById(id);
        if (!design)
            return null;
        return prisma.design.update({
            where: { id },
            data: {
                generatedImages: [...design.generatedImages, imagePath],
            },
        });
    }
    async setGeneratedImages(id, images) {
        return prisma.design.update({
            where: { id },
            data: {
                generatedImages: images,
                status: 'completed',
            },
        });
    }
    async delete(id) {
        return prisma.design.delete({
            where: { id },
        });
    }
    async countByUser(userId) {
        return prisma.design.count({
            where: { userId },
        });
    }
    async getRecentDesigns(limit = 10) {
        return prisma.design.findMany({
            where: { status: 'completed' },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { user: { select: { name: true, avatar: true } } },
        });
    }
}
export const designRepository = new DesignRepository();
//# sourceMappingURL=designRepo.js.map