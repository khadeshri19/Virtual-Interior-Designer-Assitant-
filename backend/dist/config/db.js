import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
export const prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
export async function connectDatabase() {
    try {
        await prisma.$connect();
        logger.info('✅ Database connected successfully');
    }
    catch (error) {
        logger.error('❌ Database connection failed:', error);
        throw error;
    }
}
export async function disconnectDatabase() {
    await prisma.$disconnect();
    logger.info('Database disconnected');
}
//# sourceMappingURL=db.js.map