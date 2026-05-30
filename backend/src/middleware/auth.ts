import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';

// Simple auth middleware - in production, integrate with Clerk or JWT
export interface AuthenticatedRequest extends Request {
    userId?: string;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get user ID from header or session
        const userId = (req.headers['x-user-id'] as string) || 'dev-user-001';

        // Try to find existing user first (faster than upsert for most requests)
        let dbUser = await prisma.user.findUnique({ where: { id: userId } });

        // If user doesn't exist, create them
        if (!dbUser) {
            try {
                dbUser = await prisma.user.create({
                    data: {
                        id: userId,
                        email: userId === 'dev-user-001' ? 'dev@vdassistant.com' : `${userId}@vdassistant.com`,
                        name: userId === 'dev-user-001' ? 'Development User' : 'User',
                    }
                });
                logger.info(`Created new user: ${userId}`);
            } catch (createError: any) {
                // Handle race condition: user may have been created by concurrent request
                if (createError.code === 'P2002') {
                    dbUser = await prisma.user.findUnique({ where: { id: userId } });
                }
                if (!dbUser) {
                    throw createError;
                }
            }
        }

        req.userId = dbUser.id;
        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || undefined,
        };

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Authentication failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const optionalAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if (userId) {
            const dbUser = await prisma.user.findUnique({ where: { id: userId } });
            if (dbUser) {
                req.userId = dbUser.id;
                req.user = {
                    id: dbUser.id,
                    email: dbUser.email,
                    name: dbUser.name || undefined,
                };
            } else {
                req.userId = userId;
            }
        }

        next();
    } catch (error) {
        // Continue without auth for optional routes
        next();
    }
};
