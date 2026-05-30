import { designRepository } from '../repository/designRepo.js';
import { aiService } from '../services/aiService.js';
import { imageService } from '../services/imageService.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { SUPPORTED_STYLES, SUPPORTED_ROOM_TYPES } from '../types/design.js';
export class DesignController {
    // Create a new design request
    async create(req, res, next) {
        try {
            const userId = req.userId;
            const file = req.file;
            const { style, roomType, budget, dimensions, lighting, clutter, colorScheme } = req.body;
            if (!file) {
                throw new ValidationError('Room image is required');
            }
            // Save uploaded image
            const uploadedImage = await imageService.saveUploadedImage(file, userId);
            // Create design record
            const design = await designRepository.create({
                userId,
                originalImage: uploadedImage.url,
                style: style,
                roomType: roomType,
                budget: budget ? parseFloat(budget) : undefined,
                dimensions: dimensions,
                metadata: {
                    lighting: lighting,
                    clutter: clutter,
                    colorScheme: colorScheme,
                }
            });
            logger.info(`Design created: ${design.id} for user ${userId}`);
            res.status(201).json({
                success: true,
                data: design,
                message: 'Design request created. Processing will begin shortly.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Generate design variations
    async generate(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const designId = typeof id === 'string' ? id : '';
            const design = await designRepository.findById(designId);
            if (!design || design.userId !== userId) {
                throw new NotFoundError('Design not found');
            }
            // Update status to processing
            await designRepository.updateStatus(designId, 'processing');
            // 1. Generate redesigned images (using the new Gemini-enhanced flow)
            const generatedImages = await aiService.generateRoomRedesign(design.originalImage, design.style, design.roomType, design.budget ?? undefined, 1 // Only 1 variation requested by user
            );
            // 2. Generate a personalized AI Design Story (Consultation)
            const metadataJson = design.metadata || {};
            const preferences = `Lighting: ${metadataJson.lighting || 'Natural'}, Clutter: ${metadataJson.clutter || 'Minimal'}, Dimensions: ${design.dimensions || 'Standard'}`;
            const aiStory = await aiService.consultDesign(design.style, design.roomType, preferences);
            // 3. Update design with generated images and metadata
            const metadata = {
                ...metadataJson,
                aiStory,
                generatedAt: new Date().toISOString()
            };
            const updatedDesign = await designRepository.update(designId, {
                generatedImages,
                status: 'completed',
                metadata
            });
            logger.info(`Design generated: ${designId} with ${generatedImages.length} images and AI Story`);
            res.json({
                success: true,
                data: updatedDesign,
                message: 'Design generated successfully with AI insights',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get design by ID
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const designId = typeof id === 'string' ? id : '';
            const design = await designRepository.findById(designId);
            if (!design || design.userId !== userId) {
                throw new NotFoundError('Design not found');
            }
            res.json({
                success: true,
                data: design,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all designs for user
    async getAll(req, res, next) {
        try {
            const userId = req.userId;
            const pageInt = parseInt(req.query.page) || 1;
            const limitInt = parseInt(req.query.limit) || 10;
            const offset = (pageInt - 1) * limitInt;
            const designs = await designRepository.findByUserId(userId, limitInt, offset);
            const total = await designRepository.countByUser(userId);
            res.json({
                success: true,
                data: {
                    designs,
                    pagination: {
                        page: pageInt,
                        limit: limitInt,
                        total,
                        pages: Math.ceil(total / limitInt),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete design
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const designId = typeof id === 'string' ? id : '';
            const design = await designRepository.findById(designId);
            if (!design || design.userId !== userId) {
                throw new NotFoundError('Design not found');
            }
            // Delete associated images
            await imageService.deleteImage(design.originalImage);
            for (const img of design.generatedImages) {
                await imageService.deleteImage(img);
            }
            await designRepository.delete(designId);
            logger.info(`Design deleted: ${designId}`);
            res.json({
                success: true,
                message: 'Design deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get design suggestions
    async getSuggestions(req, res, next) {
        try {
            const { style, roomType, budget } = req.query;
            const suggestions = await aiService.generateDesignSuggestions(roomType || 'Living Room', style || 'Modern');
            res.json({
                success: true,
                data: suggestions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get gallery of recent completed designs
    async getGallery(req, res, next) {
        try {
            const limitInt = parseInt(req.query.limit) || 12;
            const designs = await designRepository.getRecentDesigns(limitInt);
            res.json({
                success: true,
                data: designs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get available styles and room types
    async getOptions(req, res) {
        res.json({
            success: true,
            data: {
                styles: SUPPORTED_STYLES,
                roomTypes: SUPPORTED_ROOM_TYPES,
            },
        });
    }
}
export const designController = new DesignController();
//# sourceMappingURL=designController.js.map