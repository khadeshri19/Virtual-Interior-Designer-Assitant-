import { GoogleGenAI } from '@google/genai';
import { HfInference } from '@huggingface/inference';
import Replicate from 'replicate';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
// ============================================================================
// FALLBACK IMAGE LIBRARY (used when ALL AI providers fail)
// ============================================================================
const FALLBACK_IMAGE_LIBRARY = {
    'Modern': {
        'Living Room': [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1280&q=90',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=90',
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1280&q=90',
        ],
        'Bedroom': [
            'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1280&q=90',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1280&q=90',
        ],
        'Kitchen': [
            'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90',
            'https://images.unsplash.com/photo-1600566752355-3979ff69a3cf?w=1280&q=90',
        ],
        'default': ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1280&q=90']
    },
    'Minimalist': {
        'default': [
            'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1280&q=90',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1280&q=90',
        ]
    },
    'Scandinavian': {
        'default': [
            'https://images.unsplash.com/photo-1594913785162-e6785b49dea3?w=1280&q=90',
            'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1280&q=90',
        ]
    },
    'Luxury': {
        'default': [
            'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?w=1280&q=90',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1280&q=90',
        ]
    },
    'Industrial': {
        'default': [
            'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1280&q=90',
            'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1280&q=90',
        ]
    },
    'Traditional': {
        'default': [
            'https://images.unsplash.com/photo-1600607687937-45a94f01be33?w=1280&q=90',
            'https://images.unsplash.com/photo-1615873968403-89e068629275?w=1280&q=90',
        ]
    },
    'Coastal': {
        'default': [
            'https://images.unsplash.com/photo-1507089947368-19c1ac977534?w=1280&q=90',
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1280&q=90',
        ]
    },
    'Farmhouse': {
        'default': [
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1280&q=90',
            'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1280&q=90',
        ]
    },
    'default': {
        'default': [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=90',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1280&q=90',
        ]
    }
};
// ============================================================================
// DESIGN DATABASE — Knowledge hub for prompt engineering & consultations
// ============================================================================
const DESIGN_DATABASE = {
    MATERIALS: {
        Modern: ['Polished Concrete', 'Brushed Nickel', 'Carrara Marble', 'Tempered Glass', 'Smoked Oak'],
        Minimalist: ['Smooth Plaster', 'Natural Linen', 'Light Ash Wood', 'Honed Stone', 'Matte White Steel'],
        Scandinavian: ['Blonde Birch', 'Sheepskin', 'Light Pine', 'Woven Sisal', 'Ceramic'],
        Industrial: ['Exposed Red Brick', 'Weathered Steel', 'Reclaimed Barn Wood', 'Cast Iron', 'Corrugated Metal'],
        Luxury: ['Brazilian Rosewood', 'Egyptian Cotton', 'Gold Leaf', 'Exotic Onyx', 'Plush Velvet', 'Swarovski Crystal'],
        Traditional: ['Dark Mahogany', 'Wrought Iron', 'Velvet Damask', 'Antique Brass', 'Persian Wool'],
        Coastal: ['Driftwood', 'Bleached Jute', 'Polished Shell', 'Light Cotton', 'Clear Glass'],
        Farmhouse: ['Distressed Pine', 'Galvanized Metal', 'Cast Iron', 'Soapstone', 'Rough-hewn Beams']
    },
    COLORS: {
        Modern: ['Charcoal Gray', 'Pure White', 'Electric Blue', 'Chrome', 'Deep Teal'],
        Minimalist: ['Alabaster', 'Stone Grey', 'Warm White', 'Oatmeal', 'Soft Black'],
        Scandinavian: ['Ice Blue', 'Light Sage', 'Warm Birch', 'Cloud White', 'Soft Rose'],
        Industrial: ['Rust Iron', 'Midnight Black', 'Dirty Copper', 'Cement Gray', 'Burnt Orange'],
        Luxury: ['Royal Emerald', 'Champagne Gold', 'Midnight Purple', 'Ivory', 'Deep Sapphire'],
        Traditional: ['Forest Green', 'Burgundy Red', 'Warm Cream', 'Deep Walnut', 'Navy Blue'],
        Coastal: ['Seafoam', 'Aqua', 'Sandy Beige', 'Coral', 'Sky Blue'],
        Farmhouse: ['Soft Eggshell', 'Barn Red', 'Sage Green', 'Warm Honey', 'Blackened Steel']
    },
    FURNITURE: {
        'Living Room': ['L-shaped Sectional', 'Nesting Coffee Tables', 'Accent Lounge Chair', 'Floating Media Console', 'Arc Floor Lamp'],
        'Bedroom': ['Platform Bed', 'Upholstered Headboard', 'Sleek Nightstands', 'Velvet Bench', 'Full-length Mirror'],
        'Kitchen': ['Waterfall Island', 'Bar Stools', 'Pendant Lighting', 'Built-in Pantry', 'Minimalist Cabinetry'],
        'Dining Room': ['Live Edge Table', 'Mid-century Chairs', 'Buffet Server', 'Modern Chandelier', 'Area Rug'],
        'Home Office': ['Ergonomic Task Chair', 'Floating Desk', 'Bookshelves', 'Ambient Desk Lamp', 'Abstract Art'],
        'Bathroom': ['Floating Vanity', 'Rainfall Shower', 'Freestanding Tub', 'LED Mirror', 'Bamboo Accessories']
    },
    LIGHTING: {
        styles: ['Recessed LED strips', 'Statement Chandeliers', 'Industrial Pendants', 'Concealed Sconces', 'Floor-to-ceiling Natural Light'],
        atmospheres: ['Golden Hour Glow', 'Cinematic High-Contrast', 'Soft Architectural Shadow', 'Bright Museum-Quality Lighting']
    }
};
// ============================================================================
// AI SERVICE — Multi-Provider Interior Design Engine
// ============================================================================
// Priority Order:
//   1. Google Gemini 2.5 Flash   (best quality, image-to-image, free 10 RPM / 500 RPD)
//   2. Replicate interior-design  (purpose-built ControlNet model, ~$0.006/run with free credits)
//   3. Hugging Face instruct-pix2pix (free, instruction-based image editing)
//   4. Curated Unsplash library   (always works, zero cost)
// ============================================================================
const IMAGE_MODEL = 'gemini-2.5-flash-image'; // For image generation/editing
const TEXT_MODEL = 'gemini-2.0-flash'; // For text consultations
const REPLICATE_INTERIOR_MODEL = 'adirik/interior-design:76604baddc85b1b4616e1c6475571571f90f960e90f3dab2585a31268bcc9e10';
const HF_PIX2PIX_MODEL = 'timbrooks/instruct-pix2pix'; // Image-to-image editing
const HF_SDXL_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'; // Text-to-image fallback
const MAX_RETRIES = 3;
export class AIService {
    ai;
    geminiAvailable = false;
    replicate;
    replicateAvailable = false;
    hf;
    hfAvailable = false;
    constructor() {
        // --- Provider 1: Google Gemini ---
        const apiKey = process.env.GOOGLE_API_KEY || '';
        this.ai = new GoogleGenAI({ apiKey });
        if (apiKey && apiKey !== 'dummy_key' && apiKey.startsWith('AIza')) {
            this.geminiAvailable = true;
            logger.info(`✅ [Provider 1] Gemini initialized — Image: ${IMAGE_MODEL}, Text: ${TEXT_MODEL}`);
        }
        else {
            logger.warn('⚠️ [Provider 1] Gemini: No valid GOOGLE_API_KEY');
        }
        // --- Provider 2: Replicate (Interior Design ControlNet) ---
        const replicateToken = process.env.REPLICATE_API_TOKEN || '';
        this.replicate = new Replicate({ auth: replicateToken });
        if (replicateToken && replicateToken.startsWith('r8_')) {
            this.replicateAvailable = true;
            logger.info(`✅ [Provider 2] Replicate initialized — Model: adirik/interior-design`);
        }
        else {
            logger.warn('⚠️ [Provider 2] Replicate: No valid REPLICATE_API_TOKEN');
        }
        // --- Provider 3: Hugging Face (instruct-pix2pix) ---
        const hfKey = process.env.HUGGINGFACE_API_KEY || '';
        this.hf = new HfInference(hfKey);
        if (hfKey && hfKey.startsWith('hf_')) {
            this.hfAvailable = true;
            logger.info(`✅ [Provider 3] Hugging Face initialized — Model: ${HF_PIX2PIX_MODEL}`);
        }
        else {
            logger.warn('⚠️ [Provider 3] Hugging Face: No valid HUGGINGFACE_API_KEY');
        }
        // Summary
        const activeProviders = [
            this.geminiAvailable && 'Gemini',
            this.replicateAvailable && 'Replicate',
            this.hfAvailable && 'HuggingFace',
            'Fallback Library'
        ].filter(Boolean);
        logger.info(`🎨 AI Service ready with ${activeProviders.length} providers: ${activeProviders.join(' → ')}`);
    }
    async checkServices() {
        return {
            gemini: this.geminiAvailable,
            replicate: this.replicateAvailable,
            huggingface: this.hfAvailable,
            imageModel: IMAGE_MODEL,
            replicateModel: 'adirik/interior-design',
            hfImageModel: HF_PIX2PIX_MODEL,
            textModel: TEXT_MODEL,
            database: 'READY',
            providers: [
                this.geminiAvailable && 'Gemini 2.5 Flash (image-to-image)',
                this.replicateAvailable && 'Replicate Interior Design (ControlNet)',
                this.hfAvailable && 'Hugging Face instruct-pix2pix (image editing)',
                'Curated Unsplash Fallback'
            ].filter(Boolean),
            status: this.geminiAvailable
                ? `Primary: ${IMAGE_MODEL} (image-to-image) + ${TEXT_MODEL} (text)`
                : this.replicateAvailable
                    ? 'Primary: Replicate adirik/interior-design (ControlNet)'
                    : this.hfAvailable
                        ? `Primary: Hugging Face ${HF_PIX2PIX_MODEL} (image editing)`
                        : 'Running on curated image library (no API keys)',
        };
    }
    // ========================================================================
    // RETRY HELPER — Exponential backoff for rate limiting (429)
    // ========================================================================
    async withRetry(fn, label) {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                const is429 = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
                if (is429 && attempt < MAX_RETRIES) {
                    const waitSec = Math.pow(2, attempt) * 5; // 10s, 20s, 40s
                    logger.warn(`⏳ ${label}: Rate limited (429). Retrying in ${waitSec}s... (attempt ${attempt}/${MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, waitSec * 1000));
                    continue;
                }
                throw error;
            }
        }
        throw new Error(`${label}: All ${MAX_RETRIES} retries exhausted`);
    }
    // ========================================================================
    // BUILD PROMPT — Rich architectural prompt from the design database
    // ========================================================================
    buildRedesignPrompt(style, roomType, budget) {
        const materials = DESIGN_DATABASE.MATERIALS[style] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style] || DESIGN_DATABASE.COLORS.Modern;
        const furniture = DESIGN_DATABASE.FURNITURE[roomType] || DESIGN_DATABASE.FURNITURE['Living Room'];
        const m1 = materials[Math.floor(Math.random() * materials.length)];
        const m2 = materials[Math.floor(Math.random() * materials.length)];
        const c1 = colors[Math.floor(Math.random() * colors.length)];
        const c2 = colors[Math.floor(Math.random() * colors.length)];
        const f1 = furniture[Math.floor(Math.random() * furniture.length)];
        const f2 = furniture[Math.floor(Math.random() * furniture.length)];
        const light = DESIGN_DATABASE.LIGHTING.atmospheres[Math.floor(Math.random() * DESIGN_DATABASE.LIGHTING.atmospheres.length)];
        const budgetNote = budget
            ? `The design should feel ${budget < 500 ? 'budget-friendly and practical' : budget < 2000 ? 'mid-range with tasteful choices' : 'luxurious and premium'}.`
            : '';
        return `Redesign this room as a stunning ${style} ${roomType}. 
Keep the exact same room layout, walls, windows, and structural elements, but completely transform the interior design.

Design specifications:
- Style: ${style}
- Furniture: Include ${f1} and ${f2}
- Materials: Use ${m1} and ${m2} finishes  
- Color palette: ${c1} as primary, ${c2} as accent
- Lighting: ${light}
${budgetNote}

The result must be a photorealistic, professional interior design photograph. 
8K quality, architectural photography, magazine-worthy composition.
Maintain the room's dimensions and perspective from the original photo.`;
    }
    // ========================================================================
    // BUILD REPLICATE PROMPT — Shorter, ControlNet-optimized prompt
    // ========================================================================
    buildReplicatePrompt(style, roomType, budget) {
        const materials = DESIGN_DATABASE.MATERIALS[style] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style] || DESIGN_DATABASE.COLORS.Modern;
        const furniture = DESIGN_DATABASE.FURNITURE[roomType] || DESIGN_DATABASE.FURNITURE['Living Room'];
        const m1 = materials[Math.floor(Math.random() * materials.length)];
        const c1 = colors[Math.floor(Math.random() * colors.length)];
        const f1 = furniture[Math.floor(Math.random() * furniture.length)];
        const f2 = furniture[Math.floor(Math.random() * furniture.length)];
        return `A beautiful ${style.toLowerCase()} ${roomType.toLowerCase()} interior design, ${f1}, ${f2}, ${m1} materials, ${c1} color palette, natural lighting, photorealistic, interior design magazine, 8k, high quality`;
    }
    // ========================================================================
    // BUILD PIX2PIX PROMPT — Instruction-style for instruct-pix2pix
    // ========================================================================
    buildPix2PixPrompt(style, roomType) {
        const materials = DESIGN_DATABASE.MATERIALS[style] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style] || DESIGN_DATABASE.COLORS.Modern;
        const m1 = materials[Math.floor(Math.random() * materials.length)];
        const c1 = colors[Math.floor(Math.random() * colors.length)];
        return `Transform this room into a beautiful ${style.toLowerCase()} ${roomType.toLowerCase()} with ${m1} finishes and ${c1} color palette, add stylish furniture, professional interior design photography`;
    }
    // ========================================================================
    // GENERATE ROOM REDESIGN — Core multi-provider generation pipeline
    // ========================================================================
    async generateRoomRedesign(inputImagePath, style, roomType, budget, count = 1) {
        logger.info(`🎨 Generating ${style} ${roomType} redesign (count: ${count})`);
        logger.info(`📋 Provider chain: Gemini → Replicate → HuggingFace → Fallback`);
        // ─── Provider 1: Google Gemini 2.5 Flash (image-to-image) ───
        if (this.geminiAvailable) {
            try {
                logger.info(`🔷 Trying Provider 1: Gemini ${IMAGE_MODEL}...`);
                const results = await this.generateWithGemini(inputImagePath, style, roomType, budget, count);
                if (results.length > 0) {
                    logger.info(`✅ Gemini generated ${results.length} image(s) successfully`);
                    return results;
                }
            }
            catch (error) {
                logger.error(`❌ Provider 1 (Gemini) failed: ${error.message}`);
            }
        }
        // ─── Provider 2: Replicate Interior Design (ControlNet) ───
        if (this.replicateAvailable) {
            try {
                logger.info(`🔶 Trying Provider 2: Replicate adirik/interior-design...`);
                const results = await this.generateWithReplicate(inputImagePath, style, roomType, budget, count);
                if (results.length > 0) {
                    logger.info(`✅ Replicate generated ${results.length} image(s) successfully`);
                    return results;
                }
            }
            catch (error) {
                logger.error(`❌ Provider 2 (Replicate) failed: ${error.message}`);
            }
        }
        // ─── Provider 3: Hugging Face instruct-pix2pix (image editing) ───
        if (this.hfAvailable) {
            try {
                logger.info(`🟢 Trying Provider 3: HuggingFace instruct-pix2pix...`);
                const results = await this.generateWithHuggingFace(inputImagePath, style, roomType, budget, count);
                if (results.length > 0) {
                    logger.info(`✅ HuggingFace generated ${results.length} image(s) successfully`);
                    return results;
                }
            }
            catch (error) {
                logger.error(`❌ Provider 3 (HuggingFace) failed: ${error.message}`);
            }
        }
        // ─── Provider 4: Curated Unsplash fallback ───
        logger.info(`📸 All AI providers exhausted. Using curated fallback library.`);
        return this.getFallbackImages(style, roomType, count);
    }
    // ========================================================================
    // PROVIDER 1: GEMINI IMAGE GENERATION — Image-to-image with Gemini
    // ========================================================================
    async generateWithGemini(inputImagePath, style, roomType, budget, count = 1) {
        const prompt = this.buildRedesignPrompt(style, roomType, budget);
        const generatedPaths = [];
        // Read the user's uploaded room image
        const imageBuffer = await this.loadInputImage(inputImagePath);
        const base64Image = imageBuffer.toString('base64');
        // Determine MIME type from the file extension
        const ext = path.extname(inputImagePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        logger.info(`📸 Sending room image (${(imageBuffer.length / 1024).toFixed(1)}KB) to Gemini...`);
        for (let i = 0; i < count; i++) {
            try {
                logger.info(`🔄 Gemini image request ${i + 1}/${count}`);
                const response = await this.withRetry(() => this.ai.models.generateContent({
                    model: IMAGE_MODEL,
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: prompt },
                                { inlineData: { mimeType, data: base64Image } },
                            ],
                        },
                    ],
                    config: {
                        responseModalities: ['Text', 'Image'],
                    },
                }), `Gemini image ${i + 1}`);
                // Extract the generated image from the response
                if (response.candidates && response.candidates[0]?.content?.parts) {
                    for (const part of response.candidates[0].content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            const savedPath = await this.saveGeneratedImage(part.inlineData.data, part.inlineData.mimeType || 'image/png');
                            generatedPaths.push(savedPath);
                            logger.info(`✅ Gemini image ${i + 1}/${count} saved: ${savedPath}`);
                        }
                        if (part.text) {
                            logger.info(`📝 Gemini notes: ${part.text.substring(0, 200)}...`);
                        }
                    }
                }
            }
            catch (error) {
                logger.error(`Failed Gemini image ${i + 1}/${count}: ${error.message}`);
            }
        }
        return generatedPaths;
    }
    // ========================================================================
    // PROVIDER 2: REPLICATE — adirik/interior-design (ControlNet + Segmentation)
    // Purpose-built for converting empty rooms → designed interiors
    // Uses ControlNet segmentation + MLSD lines to preserve room layout
    // Free credits on sign-up, ~$0.006/run after
    // ========================================================================
    async generateWithReplicate(inputImagePath, style, roomType, budget, count = 1) {
        const prompt = this.buildReplicatePrompt(style, roomType, budget);
        const negativePrompt = 'ugly, deformed, noisy, blurry, low quality, oversaturated, bad anatomy, poorly drawn, watermark, text, signature, out of frame';
        const generatedPaths = [];
        // Read the user's uploaded room image and convert to data URI
        const imageBuffer = await this.loadInputImage(inputImagePath);
        const ext = path.extname(inputImagePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const dataUri = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        logger.info(`📸 Sending room image (${(imageBuffer.length / 1024).toFixed(1)}KB) to Replicate interior-design...`);
        logger.info(`📝 Prompt: ${prompt.substring(0, 120)}...`);
        for (let i = 0; i < count; i++) {
            try {
                logger.info(`🔄 Replicate request ${i + 1}/${count}`);
                const output = await this.withRetry(async () => {
                    const result = await this.replicate.run(REPLICATE_INTERIOR_MODEL, {
                        input: {
                            image: dataUri,
                            prompt: prompt,
                            negative_prompt: negativePrompt,
                            num_inference_steps: 30,
                            guidance_scale: 7.5,
                            prompt_strength: 0.8,
                        },
                    });
                    return result;
                }, `Replicate image ${i + 1}`);
                // Replicate returns an output URL (string or array of strings)
                const outputUrl = Array.isArray(output) ? output[0] : output;
                if (outputUrl && typeof outputUrl === 'string') {
                    // Download the image from Replicate's CDN and save locally
                    const savedPath = await this.downloadAndSaveImage(outputUrl);
                    generatedPaths.push(savedPath);
                    logger.info(`✅ Replicate image ${i + 1}/${count} saved: ${savedPath}`);
                }
                else if (outputUrl && typeof outputUrl === 'object') {
                    // Handle ReadableStream or other object types
                    const urlStr = String(outputUrl);
                    if (urlStr.startsWith('http')) {
                        const savedPath = await this.downloadAndSaveImage(urlStr);
                        generatedPaths.push(savedPath);
                        logger.info(`✅ Replicate image ${i + 1}/${count} saved: ${savedPath}`);
                    }
                }
            }
            catch (error) {
                logger.error(`Failed Replicate image ${i + 1}/${count}: ${error.message}`);
            }
        }
        return generatedPaths;
    }
    // ========================================================================
    // PROVIDER 3: HUGGING FACE — instruct-pix2pix (Image-to-Image Editing)
    // Takes the uploaded room photo and edits it based on instructions
    // Free tier, instruction-based (e.g., "transform into modern living room")
    // Falls back to SDXL text-to-image if pix2pix fails
    // ========================================================================
    async generateWithHuggingFace(inputImagePath, style, roomType, budget, count = 1) {
        const generatedPaths = [];
        // First try: instruct-pix2pix (image-to-image editing)
        try {
            const imageBuffer = await this.loadInputImage(inputImagePath);
            const pix2pixPrompt = this.buildPix2PixPrompt(style, roomType);
            logger.info(`📸 Sending room image (${(imageBuffer.length / 1024).toFixed(1)}KB) to HF instruct-pix2pix...`);
            for (let i = 0; i < count; i++) {
                try {
                    logger.info(`🔄 HF pix2pix request ${i + 1}/${count}`);
                    // Create a Blob from the image buffer for the HF API
                    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
                    const result = await this.withRetry(() => this.hf.imageToImage({
                        model: HF_PIX2PIX_MODEL,
                        inputs: imageBlob,
                        parameters: {
                            prompt: pix2pixPrompt,
                            guidance_scale: 7.5,
                            image_guidance_scale: 1.5,
                        },
                    }), `HF pix2pix ${i + 1}`);
                    // Convert result to buffer and save
                    const base64Data = await this.blobToBase64(result);
                    const savedPath = await this.saveGeneratedImage(base64Data, 'image/jpeg');
                    generatedPaths.push(savedPath);
                    logger.info(`✅ HF pix2pix image ${i + 1}/${count} saved: ${savedPath}`);
                }
                catch (error) {
                    logger.error(`HF pix2pix image ${i + 1} failed: ${error.message}`);
                }
            }
            if (generatedPaths.length > 0)
                return generatedPaths;
        }
        catch (error) {
            logger.error(`HF instruct-pix2pix completely failed: ${error.message}`);
        }
        // Second try: SDXL text-to-image (doesn't use room photo, but generates matching style)
        logger.info(`⬇️ pix2pix failed, falling back to HF SDXL text-to-image...`);
        const textPrompt = this.buildRedesignPrompt(style, roomType, budget);
        for (let i = 0; i < count; i++) {
            try {
                logger.info(`🔄 HF SDXL request ${i + 1}/${count}`);
                const blob = await this.withRetry(() => this.hf.textToImage({
                    model: HF_SDXL_MODEL,
                    inputs: textPrompt,
                    parameters: {
                        width: 1024,
                        height: 1024,
                        num_inference_steps: 30,
                        guidance_scale: 7.5,
                    },
                }), `HF SDXL ${i + 1}`);
                const base64Data = await this.blobToBase64(blob);
                const savedPath = await this.saveGeneratedImage(base64Data, 'image/jpeg');
                generatedPaths.push(savedPath);
                logger.info(`✅ HF SDXL image ${i + 1}/${count} saved: ${savedPath}`);
            }
            catch (error) {
                logger.error(`HF SDXL image ${i + 1} failed: ${error.message}`);
            }
        }
        return generatedPaths;
    }
    // ========================================================================
    // BLOB TO BASE64 HELPER
    // ========================================================================
    async blobToBase64(blob) {
        if (typeof blob === 'object' && typeof blob.arrayBuffer === 'function') {
            const arrayBuffer = await blob.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        }
        else if (Buffer.isBuffer(blob)) {
            return blob.toString('base64');
        }
        else if (typeof blob === 'string') {
            if (blob.startsWith('http')) {
                const response = await fetch(blob);
                const arrBuf = await response.arrayBuffer();
                return Buffer.from(arrBuf).toString('base64');
            }
            return blob; // Already base64
        }
        throw new Error('Unknown blob format');
    }
    // ========================================================================
    // LOAD INPUT IMAGE — Resolve the uploaded image path and read it
    // ========================================================================
    async loadInputImage(inputImagePath) {
        let fullPath;
        if (path.isAbsolute(inputImagePath)) {
            fullPath = inputImagePath;
        }
        else if (inputImagePath.startsWith('/uploads/')) {
            const relativePath = inputImagePath.replace('/uploads/', '');
            fullPath = path.join(UPLOAD_DIR, relativePath);
        }
        else {
            fullPath = path.join(UPLOAD_DIR, inputImagePath);
        }
        logger.info(`📂 Loading input image from: ${fullPath}`);
        try {
            const buffer = await fs.readFile(fullPath);
            if (buffer.length < 100) {
                throw new Error('Image file is too small or empty');
            }
            return buffer;
        }
        catch (error) {
            logger.error(`Failed to read input image: ${fullPath} — ${error.message}`);
            throw new Error(`Could not load room image: ${error.message}`);
        }
    }
    // ========================================================================
    // SAVE GENERATED IMAGE — Write base64 output to disk
    // ========================================================================
    async saveGeneratedImage(base64Data, mimeType) {
        const generatedDir = path.join(UPLOAD_DIR, 'generated');
        await fs.mkdir(generatedDir, { recursive: true });
        const ext = mimeType.includes('png') ? '.png' : mimeType.includes('webp') ? '.webp' : '.jpg';
        const filename = `ai-${uuidv4()}${ext}`;
        const filePath = path.join(generatedDir, filename);
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(filePath, buffer);
        logger.info(`💾 Generated image saved: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
        return `/uploads/generated/${filename}`;
    }
    // ========================================================================
    // DOWNLOAD AND SAVE IMAGE — Download from URL (Replicate CDN) and save
    // ========================================================================
    async downloadAndSaveImage(url) {
        const generatedDir = path.join(UPLOAD_DIR, 'generated');
        await fs.mkdir(generatedDir, { recursive: true });
        logger.info(`⬇️ Downloading generated image from: ${url.substring(0, 80)}...`);
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: { 'User-Agent': 'VD-Assistant/2.0' },
        });
        const buffer = Buffer.from(response.data);
        // Detect extension from content-type
        const contentType = response.headers['content-type'] || 'image/jpeg';
        let ext = '.jpg';
        if (contentType.includes('png'))
            ext = '.png';
        else if (contentType.includes('webp'))
            ext = '.webp';
        const filename = `ai-${uuidv4()}${ext}`;
        const filePath = path.join(generatedDir, filename);
        await fs.writeFile(filePath, buffer);
        logger.info(`💾 Downloaded image saved: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
        return `/uploads/generated/${filename}`;
    }
    // ========================================================================
    // FALLBACK IMAGES — Curated Unsplash library when ALL providers fail
    // ========================================================================
    getFallbackImages(style, roomType, count) {
        const stylePool = FALLBACK_IMAGE_LIBRARY[style] || FALLBACK_IMAGE_LIBRARY['default'];
        const roomPool = stylePool[roomType] || stylePool['default'] || FALLBACK_IMAGE_LIBRARY['default']['default'];
        const shuffled = [...roomPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    // ========================================================================
    // CONSULT DESIGN — AI-powered design consultation using Gemini
    // ========================================================================
    async consultDesign(style, roomType, preferences) {
        logger.info(`💡 Generating design consultation for ${style} ${roomType}`);
        // Try Gemini text generation for a rich consultation
        if (this.geminiAvailable) {
            try {
                const response = await this.withRetry(() => this.ai.models.generateContent({
                    model: TEXT_MODEL,
                    contents: `You are a world-class interior designer. Provide a detailed, personalized design consultation for a ${style} ${roomType}.

User preferences: ${preferences}

Provide your consultation covering:
1. **Furniture Recommendations** — Specific pieces that work for this style
2. **Material Choices** — Premium materials that define the ${style} aesthetic
3. **Color Palette** — Exact colors with reasoning
4. **Lighting Strategy** — How to create the perfect ambiance
5. **Pro Tip** — One expert-level insight most people miss

Keep it concise but detailed (under 300 words). Be specific with product types and material names.`,
                }), 'Design consultation');
                const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    logger.info('✅ Gemini consultation generated successfully');
                    return text;
                }
            }
            catch (error) {
                logger.error(`Gemini consultation failed: ${error.message}`);
            }
        }
        // Fallback to procedural consultation from local database
        return this.getLocalConsultation(style, roomType);
    }
    // ========================================================================
    // LOCAL CONSULTATION FALLBACK
    // ========================================================================
    getLocalConsultation(style, roomType) {
        const materials = DESIGN_DATABASE.MATERIALS[style] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style] || DESIGN_DATABASE.COLORS.Modern;
        return `**${style} ${roomType} Design Consultation**

1. **Furniture**: We recommend a curated mix including ${DESIGN_DATABASE.FURNITURE[roomType]?.slice(0, 3).join(', ') || 'modern essentials'}.
2. **Materials**: ${materials[0]} and ${materials[1]} create a premium ${style} look.
3. **Palette**: Primary color '${colors[0]}' balanced with '${colors[1]}' for depth.
4. **Lighting**: Use ${DESIGN_DATABASE.LIGHTING.styles[Math.floor(Math.random() * DESIGN_DATABASE.LIGHTING.styles.length)]} to enhance the ${roomType}.
5. **Pro Tip**: Adding a touch of ${materials[2] || materials[0]} will make this space truly unique.

*Generated from the VD Assistant Design Database*`;
    }
    // ========================================================================
    // DESIGN SUGGESTIONS — Quick tips powered by Gemini or local DB
    // ========================================================================
    async generateDesignSuggestions(roomType, style) {
        if (this.geminiAvailable) {
            try {
                const response = await this.withRetry(() => this.ai.models.generateContent({
                    model: TEXT_MODEL,
                    contents: `Give me exactly 5 short, specific interior design tips for a ${style} ${roomType}. 
Each tip should be one sentence. Format as a plain numbered list. No markdown, no bold.`,
                }), 'Design suggestions');
                const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    const tips = text
                        .split('\n')
                        .map((line) => line.replace(/^\d+[\.\\)]\s*/, '').trim())
                        .filter((line) => line.length > 10);
                    if (tips.length >= 3)
                        return tips.slice(0, 5);
                }
            }
            catch (error) {
                logger.error(`Gemini suggestions failed: ${error.message}`);
            }
        }
        // Fallback
        return [
            `Use ${DESIGN_DATABASE.MATERIALS[style]?.[0] || 'premium'} textures for a ${style} feel`,
            `Focus on a ${DESIGN_DATABASE.COLORS[style]?.[0] || 'neutral'} color palette`,
            `Optimize the layout for ${roomType} functionality and flow`,
            `Add ${DESIGN_DATABASE.LIGHTING.styles[Math.floor(Math.random() * DESIGN_DATABASE.LIGHTING.styles.length)]} for ambiance`,
            `Incorporate ${DESIGN_DATABASE.MATERIALS[style]?.[1] || 'natural'} accents throughout`
        ];
    }
}
export const aiService = new AIService();
//# sourceMappingURL=aiService.js.map