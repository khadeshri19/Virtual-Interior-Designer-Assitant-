import { Router } from 'express';
import multer from 'multer';
import { designController } from '../controllers/designController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { designGenerationLimiter, uploadLimiter } from '../middleware/rateLimit.js';
import { validate, designCreateSchema } from '../middleware/validate.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

// Public routes (STATIC — must come before parameterized routes)
router.get('/options', designController.getOptions.bind(designController));
router.get('/gallery', optionalAuth, designController.getGallery.bind(designController));

// Protected routes
router.use(authMiddleware);

// STATIC ROUTES FIRST (before /:id)
router.get('/suggestions', designController.getSuggestions.bind(designController));

// Create design with image upload
router.post(
    '/',
    uploadLimiter,
    upload.single('image'),
    designController.create.bind(designController)
);

// Get all designs for user
router.get('/', designController.getAll.bind(designController));

// PARAMETERIZED ROUTES LAST
router.get('/:id', designController.getById.bind(designController));

// Generate design variations
router.post(
    '/:id/generate',
    designGenerationLimiter,
    designController.generate.bind(designController)
);

// Get floor plan for a design
router.get('/:id/floorplan', designController.getFloorPlan.bind(designController));

// Delete design
router.delete('/:id', designController.delete.bind(designController));

export default router;
