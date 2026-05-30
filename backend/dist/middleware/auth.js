import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';
export const authMiddleware = async (req, res, next) => {
    try {
        // Get user ID from header or session
        const userId = req.headers['x-user-id'] || 'dev-user-001';
        // Atomic get-or-create using upsert
        const dbUser = await prisma.user.upsert({
            where: { id: userId },
            update: {}, // Do nothing if exists
            create: {
                id: userId,
                email: userId === 'dev-user-001' ? 'dev@vdassistant.com' : 'user@example.com',
                name: userId === 'dev-user-001' ? 'Development User' : 'User',
            }
        });
        req.userId = dbUser.id;
        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || undefined,
        };
        next();
    }
    catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Authentication failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
export const optionalAuth = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'];
        if (userId) {
            req.userId = userId;
            req.user = {
                id: userId,
                email: 'user@example.com',
                name: 'User',
            };
        }
        next();
    }
    catch (error) {
        // Continue without auth for optional routes
        next();
    }
};
//# sourceMappingURL=auth.js.map