import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { logger } from '../utils/logger.js';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));

                logger.warn('Validation failed:', errors);

                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: errors,
                });
                return;
            }
            next(error);
        }
    };
};

// Common validation schemas
export const designCreateSchema = z.object({
    body: z.object({
        style: z.enum([
            'Modern',
            'Minimalist',
            'Scandinavian',
            'Industrial',
            'Luxury',
            'Traditional',
            'Bohemian',
            'Mid-Century Modern',
            'Coastal',
            'Farmhouse',
        ]),
        roomType: z.enum([
            'Living Room',
            'Bedroom',
            'Kitchen',
            'Dining Room',
            'Bathroom',
            'Home Office',
            'Kids Room',
            'Outdoor Patio',
        ]),
        budget: z.number().min(0).max(1000000).optional(),
        dimensions: z.string().max(100).optional(),
    }),
});

export const chatMessageSchema = z.object({
    body: z.object({
        message: z.string().min(1).max(2000),
        context: z.object({
            style: z.string().optional(),
            roomType: z.string().optional(),
            budget: z.number().optional(),
        }).optional(),
    }),
});

export const paginationSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default('1'),
        limit: z.string().regex(/^\d+$/).optional().default('10'),
    }),
});
