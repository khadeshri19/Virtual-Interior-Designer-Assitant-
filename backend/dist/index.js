import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// Load environment variables IMMEDIATELY
dotenv.config();
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { handleError } from './utils/errors.js';
import designRoutes from './routes/designs.js';
import chatRoutes from './routes/chat.js';
import { aiService } from './services/aiService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
}));
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Rate limiting
app.use('/api/', apiLimiter);
// Static files for uploads with explicit CORS for WebGL textures
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(uploadsPath));
// Health check
app.get('/health', async (req, res) => {
    const services = await aiService.checkServices();
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services,
    });
});
// API routes
app.use('/api/designs', designRoutes);
app.use('/api/chat', chatRoutes);
// Placeholder image generator (fallback when ComfyUI is unavailable)
app.get('/api/placeholder/:style/:variant', (req, res) => {
    const { style, variant } = req.params;
    // Return a placeholder response
    res.json({
        message: 'Placeholder image',
        style,
        variant,
        note: 'ComfyUI is not available. Please start the service for actual image generation.',
    });
});
// Image Proxy Route (IMPORTANT: MUST BE ABOVE 404 HANDLER)
app.get('/api/proxy', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl)
        return res.status(400).send('URL required');
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'stream',
            timeout: 90000,
            maxRedirects: 5,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        });
        res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        response.data.pipe(res);
    }
    catch (error) {
        const status = error.response?.status || 500;
        logger.error(`Proxy failure for: ${imageUrl.split('?')[0]}... | Status: ${status} | Message: ${error.message}`);
        res.status(status).send(`Proxy error: ${error.message}`);
    }
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
    });
});
// Global error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    const { statusCode, message, code } = handleError(err);
    res.status(statusCode).json({
        success: false,
        error: message,
        code,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing connections...');
    await disconnectDatabase();
    process.exit(0);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Start server
const startServer = async () => {
    try {
        await connectDatabase();
        // Check AI services
        const services = await aiService.checkServices();
        logger.info('AI Services status:', services);
        app.listen(PORT, () => {
            logger.info(`🚀 VD Assistant Backend running on port ${PORT}`);
            logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        });
    }
    catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
export default app;
//# sourceMappingURL=index.js.map