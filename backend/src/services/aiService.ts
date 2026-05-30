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

const FALLBACK_IMAGE_LIBRARY: Record<string, Record<string, string[]>> = {
    'Modern': {
        'Living Room': ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1280&q=90','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=90','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1280&q=90','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1280&q=90','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90','https://images.unsplash.com/photo-1556911223-e153e7af6c05?w=1280&q=90','https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90'],
    },
    'Minimalist': {
        'Living Room': ['https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1280&q=90','https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1280&q=90','https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1280&q=90','https://images.unsplash.com/photo-1616047006789-b7af5af08c20?w=1280&q=90','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1280&q=90','https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1280&q=90','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1280&q=90','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90','https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90','https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90'],
    },
    'Scandinavian': {
        'Living Room': ['https://images.unsplash.com/photo-1594913785162-e6785b49dea3?w=1280&q=90','https://images.unsplash.com/photo-1560448204-61dc36dc98b8?w=1280&q=90','https://images.unsplash.com/photo-1550226129-c910a3f529cd?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1560184897-ae756221cd3e?w=1280&q=90','https://images.unsplash.com/photo-1616047006789-b7af5af08c20?w=1280&q=90','https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=90','https://images.unsplash.com/photo-1600566752355-3979ff69a3cf?w=1280&q=90','https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90'],
    },
    'Luxury': {
        'Living Room': ['https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?w=1280&q=90','https://images.unsplash.com/photo-1613977257363-707ba9f58229?w=1280&q=90','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1280&q=90','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1280&q=90','https://images.unsplash.com/photo-1600607687937-45a94f01be33?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1600566752355-3979ff69a3cf?w=1280&q=90','https://images.unsplash.com/photo-1556911223-e153e7af6c05?w=1280&q=90','https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90'],
    },
    'Industrial': {
        'Living Room': ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1280&q=90','https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1280&q=90','https://images.unsplash.com/photo-1534349762230-e0cadf78f5dd?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1505574581172-132d9e187063?w=1280&q=90','https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1280&q=90','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=90','https://images.unsplash.com/photo-1600566752355-3979ff69a3cf?w=1280&q=90','https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90','https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90','https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90'],
    },
    'Traditional': {
        'Living Room': ['https://images.unsplash.com/photo-1600607687937-45a94f01be33?w=1280&q=90','https://images.unsplash.com/photo-1585412727339-54e428d05c48?w=1280&q=90','https://images.unsplash.com/photo-1560185007-cde436f6a4c0?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1615873968403-89e068629275?w=1280&q=90','https://images.unsplash.com/photo-1560185123-18575a6ba4c6?w=1280&q=90','https://images.unsplash.com/photo-1449247709967-d4461adaf41c?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90','https://images.unsplash.com/photo-1556911223-e153e7af6c05?w=1280&q=90','https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90'],
    },
    'Coastal': {
        'Living Room': ['https://images.unsplash.com/photo-1507089947368-19c1ac977534?w=1280&q=90','https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1280&q=90','https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1280&q=90','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1280&q=90','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=90','https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90','https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90','https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90'],
    },
    'Farmhouse': {
        'Living Room': ['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1280&q=90','https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1280&q=90','https://images.unsplash.com/photo-1500315331616-db4f707c24d1?w=1280&q=90'],
        'Bedroom':     ['https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1280&q=90','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1280&q=90','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1280&q=90'],
        'Kitchen':     ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=90','https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1280&q=90','https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1280&q=90'],
        'Study Room':  ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1280&q=90','https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=90','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90'],
        'Bathroom':    ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1280&q=90','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90','https://images.unsplash.com/photo-1620626011761-996317702782?w=1280&q=90'],
        'Dining Room': ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1280&q=90','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=90'],
    },
};

// ============================================================================
// DESIGN DATABASE — Knowledge hub for prompt engineering & consultations
// ============================================================================
const DESIGN_DATABASE = {
    MATERIALS: {
        Modern:       ['Polished Concrete', 'Brushed Nickel', 'Carrara Marble', 'Tempered Glass', 'Smoked Oak'],
        Minimalist:   ['Smooth Plaster', 'Natural Linen', 'Light Ash Wood', 'Honed Stone', 'Matte White Steel'],
        Scandinavian: ['Blonde Birch', 'Sheepskin', 'Light Pine', 'Woven Sisal', 'Ceramic'],
        Industrial:   ['Exposed Red Brick', 'Weathered Steel', 'Reclaimed Barn Wood', 'Cast Iron', 'Corrugated Metal'],
        Luxury:       ['Brazilian Rosewood', 'Egyptian Cotton', 'Gold Leaf', 'Exotic Onyx', 'Plush Velvet'],
        Traditional:  ['Dark Mahogany', 'Wrought Iron', 'Velvet Damask', 'Antique Brass', 'Persian Wool'],
        Coastal:      ['Driftwood', 'Bleached Jute', 'Polished Shell', 'Light Cotton', 'Clear Glass'],
        Farmhouse:    ['Distressed Pine', 'Galvanized Metal', 'Cast Iron', 'Soapstone', 'Rough-hewn Beams'],
    },
    COLORS: {
        Modern:       ['Charcoal Gray', 'Pure White', 'Electric Blue', 'Chrome', 'Deep Teal'],
        Minimalist:   ['Alabaster', 'Stone Grey', 'Warm White', 'Oatmeal', 'Soft Black'],
        Scandinavian: ['Ice Blue', 'Light Sage', 'Warm Birch', 'Cloud White', 'Soft Rose'],
        Industrial:   ['Rust Iron', 'Midnight Black', 'Dirty Copper', 'Cement Gray', 'Burnt Orange'],
        Luxury:       ['Royal Emerald', 'Champagne Gold', 'Midnight Purple', 'Ivory', 'Deep Sapphire'],
        Traditional:  ['Forest Green', 'Burgundy Red', 'Warm Cream', 'Deep Walnut', 'Navy Blue'],
        Coastal:      ['Seafoam', 'Aqua', 'Sandy Beige', 'Coral', 'Sky Blue'],
        Farmhouse:    ['Soft Eggshell', 'Barn Red', 'Sage Green', 'Warm Honey', 'Blackened Steel'],
    },
    FURNITURE: {
        'Living Room': ['L-shaped Sectional', 'Nesting Coffee Tables', 'Accent Lounge Chair', 'Floating Media Console', 'Arc Floor Lamp'],
        'Bedroom':     ['Platform Bed', 'Upholstered Headboard', 'Sleek Nightstands', 'Velvet Bench', 'Full-length Mirror'],
        'Kitchen':     ['Waterfall Island', 'Bar Stools', 'Pendant Lighting', 'Built-in Pantry', 'Minimalist Cabinetry'],
        'Study Room':  ['Ergonomic Task Chair', 'Floating Desk', 'Built-in Bookshelves', 'Ambient Desk Lamp', 'Acoustic Panels'],
        'Bathroom':    ['Floating Vanity', 'Rainfall Shower', 'Freestanding Tub', 'LED Mirror', 'Bamboo Accessories'],
        'Dining Room': ['Live Edge Table', 'Mid-century Chairs', 'Buffet Server', 'Modern Chandelier', 'Statement Area Rug'],
    },
    LIGHTING: {
        styles: ['Recessed LED strips', 'Statement Chandeliers', 'Industrial Pendants', 'Concealed Sconces', 'Floor-to-ceiling Natural Light'],
        atmospheres: ['Golden Hour Glow', 'Cinematic High-Contrast', 'Soft Architectural Shadow', 'Bright Museum-Quality Lighting'],
    },
};
const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';
const TEXT_MODEL = 'gemini-2.0-flash';
const REPLICATE_INTERIOR_MODEL = "adirik/interior-design:7638c4031f714902f10f443b749503ed717906d013054170e8c871092e016147";
const HF_PIX2PIX_MODEL = "timbrooks/instruct-pix2pix";
const HF_SDXL_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
const MAX_RETRIES = 3;

export class AIService {
    private ai: any;
    private replicate: any;
    private hf: any;
    private geminiAvailable: boolean = false;
    private replicateAvailable: boolean = false;
    private hfAvailable: boolean = false;

    constructor() {
        const geminiKey = process.env.GOOGLE_API_KEY;
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        const hfToken = process.env.HUGGINGFACE_API_KEY;

        if (geminiKey) {
            this.ai = new GoogleGenAI({ apiKey: geminiKey });
            this.geminiAvailable = true;
        }
        if (replicateToken) {
            this.replicate = new Replicate({ auth: replicateToken });
            this.replicateAvailable = true;
        }
        if (hfToken) {
            this.hf = new HfInference(hfToken);
            this.hfAvailable = true;
        }
    }

    async checkServices() {
        return {
            gemini: this.geminiAvailable,
            replicate: this.replicateAvailable,
            hf: this.hfAvailable
        };
    }

    private async withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await fn();
            } catch (error: any) {
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

    /**
     * ADVANCEMENT: Semantic Room Auditing
     * Analyzes the uploaded room photo using Gemini Vision to identify furniture,
     * lighting, architectural features, and potential design challenges.
     */
    async analyzeRoom(inputImagePath: string): Promise<any> {
        if (!this.geminiAvailable) {
            logger.warn('⚠️ Room analysis skipped: Gemini API key missing');
            return null;
        }
        
        try {
            logger.info(`🔍 Performing semantic room audit for: ${inputImagePath.split('/').pop()}`);
            const imageBuffer = await this.loadInputImage(inputImagePath);
            const base64Image = imageBuffer.toString('base64');
            const ext = path.extname(inputImagePath).toLowerCase();
            const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

            const prompt = `Analyze this room photograph for an interior design redesign. 
            Identify:
            1. Detected Furniture (e.g., "brown leather sofa", "wooden coffee table")
            2. Architectural Features (e.g., "large bay window", "recessed ceiling")
            3. Current Lighting (e.g., "bright natural light", "dim ambient lighting")
            4. Design Challenges (e.g., "cramped layout", "clashing colors")
            5. An expert suggestion for improvement.
            
            Format your response as a valid JSON object with the following keys:
            detectedFurniture (array of strings), architecturalFeatures (array of strings), lighting (string), challenges (array of strings), suggestion (string).`;

            const result = await this.ai.models.generateContent({
                model: TEXT_MODEL,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            { inlineData: { data: base64Image, mimeType } },
                        ],
                    },
                ],
            });
            
            const text = (result as any).candidates?.[0]?.content?.parts?.[0]?.text || '';
            // Clean the response if Gemini adds markdown code blocks
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(cleanedText);
            
            logger.info('✅ Room analysis completed successfully');
            return analysis;
        } catch (error: any) {
            logger.error(`❌ Room analysis failed: ${error.message}`);
            return {
                detectedFurniture: [],
                architecturalFeatures: [],
                lighting: 'Unknown',
                challenges: [],
                suggestion: 'Proceed with general redesign.'
            };
        }
    }

    private buildRedesignPrompt(style: string, roomType: string, budget?: number, analysis?: any): string {
        const materials = DESIGN_DATABASE.MATERIALS[style as keyof typeof DESIGN_DATABASE.MATERIALS] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style as keyof typeof DESIGN_DATABASE.COLORS] || DESIGN_DATABASE.COLORS.Modern;
        const furniture = DESIGN_DATABASE.FURNITURE[roomType as keyof typeof DESIGN_DATABASE.FURNITURE] || DESIGN_DATABASE.FURNITURE['Living Room'];

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

        let analysisContext = '';
        if (analysis) {
            analysisContext = `
Specific context from room analysis:
- Existing elements: ${analysis.detectedFurniture?.join(', ') || 'Various items'}
- Architectural features: ${analysis.architecturalFeatures?.join(', ') || 'Standard walls'}
- Lighting condition: ${analysis.lighting || 'Ambient'}
- Design challenge: ${analysis.challenges?.join(', ') || 'N/A'}
- Expert tip for this room: ${analysis.suggestion || ''}
`;
        }

        return `You are an expert interior designer. Take this exact room photo and redesign ONLY the interior decor in ${style} style for a ${roomType}.

CRITICAL RULES (90% accuracy to original room):
- Keep the EXACT same room shape, walls, ceiling, floor area, windows, doors, and architectural structure
- Keep the EXACT same camera angle and perspective
- Keep the EXACT same room dimensions and proportions
- ONLY change: furniture, decor, wall colors/textures, lighting fixtures, and soft furnishings
- Do NOT add or remove walls, windows, or doors
- Do NOT change the room's structural layout
${analysisContext}
Design specifications:
- Style: ${style}
- Furniture: Include ${f1} and ${f2}
- Materials: Use ${m1} and ${m2} finishes  
- Color palette: ${c1} as primary, ${c2} as accent
- Lighting: ${light}
${budgetNote}

The output must be a photorealistic interior design photograph matching the original room's structure exactly.`;
    }

    // ========================================================================
    // BUILD REPLICATE PROMPT — Shorter, ControlNet-optimized prompt
    // ========================================================================
    private buildReplicatePrompt(style: string, roomType: string, budget?: number): string {
        const materials = DESIGN_DATABASE.MATERIALS[style as keyof typeof DESIGN_DATABASE.MATERIALS] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style as keyof typeof DESIGN_DATABASE.COLORS] || DESIGN_DATABASE.COLORS.Modern;
        const furniture = DESIGN_DATABASE.FURNITURE[roomType as keyof typeof DESIGN_DATABASE.FURNITURE] || DESIGN_DATABASE.FURNITURE['Living Room'];

        const m1 = materials[Math.floor(Math.random() * materials.length)];
        const c1 = colors[Math.floor(Math.random() * colors.length)];
        const f1 = furniture[Math.floor(Math.random() * furniture.length)];
        const f2 = furniture[Math.floor(Math.random() * furniture.length)];

        return `A beautiful ${style.toLowerCase()} ${roomType.toLowerCase()} interior design, ${f1}, ${f2}, ${m1} materials, ${c1} color palette, natural lighting, photorealistic, interior design magazine, 8k, high quality`;
    }

    // ========================================================================
    // BUILD PIX2PIX PROMPT — Instruction-style for instruct-pix2pix
    // ========================================================================
    private buildPix2PixPrompt(style: string, roomType: string): string {
        const materials = DESIGN_DATABASE.MATERIALS[style as keyof typeof DESIGN_DATABASE.MATERIALS] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style as keyof typeof DESIGN_DATABASE.COLORS] || DESIGN_DATABASE.COLORS.Modern;

        const m1 = materials[Math.floor(Math.random() * materials.length)];
        const c1 = colors[Math.floor(Math.random() * colors.length)];

        return `Transform this room into a beautiful ${style.toLowerCase()} ${roomType.toLowerCase()} with ${m1} finishes and ${c1} color palette, add stylish furniture, professional interior design photography`;
    }

    // ========================================================================
    // GENERATE ROOM REDESIGN — Core multi-provider generation pipeline
    // ========================================================================
    async generateRoomRedesign(
        inputImagePath: string,
        style: string,
        roomType: string,
        budget?: number,
        count: number = 1
    ): Promise<{ images: string[], analysis?: any }> {
        logger.info(`🎨 Generating ${style} ${roomType} redesign (count: ${count})`);
        logger.info(`📋 Provider chain: Gemini → Replicate → HuggingFace → Fallback`);

        // ADVANCEMENT: Perform room analysis first to inform the prompt
        const analysis = await this.analyzeRoom(inputImagePath);

        // ─── Provider 1: Google Gemini 2.5 Flash (image-to-image) ───
        if (this.geminiAvailable) {
            try {
                logger.info(`🔷 Trying Provider 1: Gemini ${IMAGE_MODEL}...`);
                const results = await this.generateWithGemini(inputImagePath, style, roomType, budget, count, analysis);
                if (results.length > 0) {
                    logger.info(`✅ Gemini generated ${results.length} image(s) successfully`);
                    return { images: results, analysis };
                }
            } catch (error: any) {
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
                    return { images: results, analysis };
                }
            } catch (error: any) {
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
                    return { images: results, analysis };
                }
            } catch (error: any) {
                logger.error(`❌ Provider 3 (HuggingFace) failed: ${error.message}`);
            }
        }

        // ─── Provider 4: Curated Unsplash fallback ───
        logger.info(`📸 All AI providers exhausted. Using curated fallback library.`);
        return { images: this.getFallbackImages(style, roomType, count), analysis };
    }

    // ========================================================================
    // PROVIDER 1: GEMINI IMAGE GENERATION — Image-to-image with Gemini
    // ========================================================================
    private async generateWithGemini(
        inputImagePath: string,
        style: string,
        roomType: string,
        budget?: number,
        count: number = 1,
        analysis?: any
    ): Promise<string[]> {
        const prompt = this.buildRedesignPrompt(style, roomType, budget, analysis);
        const generatedPaths: string[] = [];

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

                const response: any = await this.withRetry(() => this.ai.models.generateContent({
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
                            const savedPath = await this.saveGeneratedImage(
                                part.inlineData.data,
                                part.inlineData.mimeType || 'image/png'
                            );
                            generatedPaths.push(savedPath);
                            logger.info(`✅ Gemini image ${i + 1}/${count} saved: ${savedPath}`);
                        }
                        if (part.text) {
                            logger.info(`📝 Gemini notes: ${part.text.substring(0, 200)}...`);
                        }
                    }
                }
            } catch (error: any) {
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
    private async generateWithReplicate(
        inputImagePath: string,
        style: string,
        roomType: string,
        budget?: number,
        count: number = 1
    ): Promise<string[]> {
        const prompt = this.buildReplicatePrompt(style, roomType, budget);
        const negativePrompt = 'ugly, deformed, noisy, blurry, low quality, oversaturated, bad anatomy, poorly drawn, watermark, text, signature, out of frame';
        const generatedPaths: string[] = [];

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
                    const result = await this.replicate.run(
                        REPLICATE_INTERIOR_MODEL as `${string}/${string}:${string}`,
                        {
                            input: {
                                image: dataUri,
                                prompt: prompt,
                                negative_prompt: negativePrompt,
                                num_inference_steps: 30,
                                guidance_scale: 7.5,
                                prompt_strength: 0.8,
                            },
                        }
                    );
                    return result;
                }, `Replicate image ${i + 1}`);

                // Replicate returns an output URL (string or array of strings)
                const outputUrl = Array.isArray(output) ? output[0] : output;

                if (outputUrl && typeof outputUrl === 'string') {
                    // Download the image from Replicate's CDN and save locally
                    const savedPath = await this.downloadAndSaveImage(outputUrl as string);
                    generatedPaths.push(savedPath);
                    logger.info(`✅ Replicate image ${i + 1}/${count} saved: ${savedPath}`);
                } else if (outputUrl && typeof outputUrl === 'object') {
                    // Handle ReadableStream or other object types
                    const urlStr = String(outputUrl);
                    if (urlStr.startsWith('http')) {
                        const savedPath = await this.downloadAndSaveImage(urlStr);
                        generatedPaths.push(savedPath);
                        logger.info(`✅ Replicate image ${i + 1}/${count} saved: ${savedPath}`);
                    }
                }
            } catch (error: any) {
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
    private async generateWithHuggingFace(
        inputImagePath: string,
        style: string,
        roomType: string,
        budget?: number,
        count: number = 1
    ): Promise<string[]> {
        const generatedPaths: string[] = [];

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
                } catch (error: any) {
                    logger.error(`HF pix2pix image ${i + 1} failed: ${error.message}`);
                }
            }

            if (generatedPaths.length > 0) return generatedPaths;
        } catch (error: any) {
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
            } catch (error: any) {
                logger.error(`HF SDXL image ${i + 1} failed: ${error.message}`);
            }
        }

        return generatedPaths;
    }

    // ========================================================================
    // BLOB TO BASE64 HELPER
    // ========================================================================
    private async blobToBase64(blob: any): Promise<string> {
        if (typeof blob === 'object' && typeof blob.arrayBuffer === 'function') {
            const arrayBuffer = await blob.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        } else if (Buffer.isBuffer(blob)) {
            return blob.toString('base64');
        } else if (typeof blob === 'string') {
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
    private async loadInputImage(inputImagePath: string): Promise<Buffer> {
        let fullPath: string;

        if (path.isAbsolute(inputImagePath)) {
            fullPath = inputImagePath;
        } else if (inputImagePath.startsWith('/uploads/')) {
            const relativePath = inputImagePath.replace('/uploads/', '');
            fullPath = path.join(UPLOAD_DIR, relativePath);
        } else {
            fullPath = path.join(UPLOAD_DIR, inputImagePath);
        }

        logger.info(`📂 Loading input image from: ${fullPath}`);

        try {
            const buffer = await fs.readFile(fullPath);
            if (buffer.length < 100) {
                throw new Error('Image file is too small or empty');
            }
            return buffer;
        } catch (error: any) {
            logger.error(`Failed to read input image: ${fullPath} — ${error.message}`);
            throw new Error(`Could not load room image: ${error.message}`);
        }
    }

    // ========================================================================
    // SAVE GENERATED IMAGE — Write base64 output to disk
    // ========================================================================
    private async saveGeneratedImage(base64Data: string, mimeType: string): Promise<string> {
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
    private async downloadAndSaveImage(url: string): Promise<string> {
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
        if (contentType.includes('png')) ext = '.png';
        else if (contentType.includes('webp')) ext = '.webp';

        const filename = `ai-${uuidv4()}${ext}`;
        const filePath = path.join(generatedDir, filename);

        await fs.writeFile(filePath, buffer);
        logger.info(`💾 Downloaded image saved: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);

        return `/uploads/generated/${filename}`;
    }

    // ========================================================================
    // FALLBACK IMAGES — Curated Unsplash library when ALL providers fail
    // ========================================================================
    private getFallbackImages(style: string, roomType: string, count: number): string[] {
        const stylePool = FALLBACK_IMAGE_LIBRARY[style] || FALLBACK_IMAGE_LIBRARY['default'];
        const roomPool = stylePool[roomType] || stylePool['default'] || FALLBACK_IMAGE_LIBRARY['default']['default'];

        const shuffled = [...roomPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // ========================================================================
    // CONSULT DESIGN — AI-powered design consultation using Gemini
    // ========================================================================
    async consultDesign(style: string, roomType: string, preferences: string): Promise<string> {
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

                const text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    logger.info('✅ Gemini consultation generated successfully');
                    return text;
                }
            } catch (error: any) {
                logger.error(`Gemini consultation failed: ${error.message}`);
            }
        }

        // Fallback to procedural consultation from local database
        return this.getLocalConsultation(style, roomType);
    }

    // ========================================================================
    // LOCAL CONSULTATION FALLBACK
    // ========================================================================
    private getLocalConsultation(style: string, roomType: string): string {
        const materials = DESIGN_DATABASE.MATERIALS[style as keyof typeof DESIGN_DATABASE.MATERIALS] || DESIGN_DATABASE.MATERIALS.Modern;
        const colors = DESIGN_DATABASE.COLORS[style as keyof typeof DESIGN_DATABASE.COLORS] || DESIGN_DATABASE.COLORS.Modern;

        return `**${style} ${roomType} Design Consultation**

1. **Furniture**: We recommend a curated mix including ${DESIGN_DATABASE.FURNITURE[roomType as keyof typeof DESIGN_DATABASE.FURNITURE]?.slice(0, 3).join(', ') || 'modern essentials'}.
2. **Materials**: ${materials[0]} and ${materials[1]} create a premium ${style} look.
3. **Palette**: Primary color '${colors[0]}' balanced with '${colors[1]}' for depth.
4. **Lighting**: Use ${DESIGN_DATABASE.LIGHTING.styles[Math.floor(Math.random() * DESIGN_DATABASE.LIGHTING.styles.length)]} to enhance the ${roomType}.
5. **Pro Tip**: Adding a touch of ${materials[2] || materials[0]} will make this space truly unique.

*Generated from the VD Assistant Design Database*`;
    }

    // ========================================================================
    // DESIGN SUGGESTIONS — Quick tips powered by Gemini or local DB
    // ========================================================================
    async generateDesignSuggestions(roomType: string, style: string) {
        if (this.geminiAvailable) {
            try {
                const response = await this.withRetry(() => this.ai.models.generateContent({
                    model: TEXT_MODEL,
                    contents: `Give me exactly 5 short, specific interior design tips for a ${style} ${roomType}. 
Each tip should be one sentence. Format as a plain numbered list. No markdown, no bold.`,
                }), 'Design suggestions');
                const text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    const tips = text
                        .split('\n')
                        .map((line: string) => line.replace(/^\d+[\.\\)]\s*/, '').trim())
                        .filter((line: string) => line.length > 10);
                    if (tips.length >= 3) return tips.slice(0, 5);
                }
            } catch (error: any) {
                logger.error(`Gemini suggestions failed: ${error.message}`);
            }
        }

        // Fallback
        return [
            `Use ${DESIGN_DATABASE.MATERIALS[style as keyof typeof DESIGN_DATABASE.MATERIALS]?.[0] || 'premium'} textures for a ${style} feel`,
            `Focus on a ${DESIGN_DATABASE.COLORS[style as keyof typeof DESIGN_DATABASE.COLORS]?.[0] || 'neutral'} color palette`,
            `Optimize the layout for ${roomType} functionality and flow`,
            `Add ${DESIGN_DATABASE.LIGHTING.styles[Math.floor(Math.random() * DESIGN_DATABASE.LIGHTING.styles.length)]} for ambiance`,
            `Incorporate ${DESIGN_DATABASE.MATERIALS[style as keyof typeof DESIGN_DATABASE.MATERIALS]?.[1] || 'natural'} accents throughout`
        ];
    }

    // ========================================================================
    // FLOOR PLAN GENERATION — Generate a floor plan from a room photo
    // ========================================================================
    async generateFloorPlan(inputImagePath: string, roomType: string): Promise<{
        floorPlan: string;
        dimensions: string;
        furniturePlacement: string[];
    }> {
        logger.info(`📐 Generating floor plan for ${roomType}`);

        if (!this.geminiAvailable) {
            return this.getLocalFloorPlan(roomType);
        }

        try {
            const imageBuffer = await this.loadInputImage(inputImagePath);
            const base64Image = imageBuffer.toString('base64');
            const ext = path.extname(inputImagePath).toLowerCase();
            const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

            const result = await this.withRetry(() => this.ai.models.generateContent({
                model: TEXT_MODEL,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `You are an expert interior architect. Analyze this ${roomType} photo and generate a detailed floor plan.

Respond with a valid JSON object containing:
1. "floorPlan": An ASCII art top-down floor plan of this room using characters like | - + for walls, D for doors, W for windows, and labels for furniture positions. Make it approximately 20 lines tall and 40 chars wide.
2. "dimensions": Estimated room dimensions (e.g., "12ft x 14ft / 3.6m x 4.2m")
3. "furniturePlacement": An array of strings describing each furniture item and its placement (e.g., "Sofa - centered on south wall", "Coffee table - 2ft from sofa, center of room")

Be specific about furniture positions relative to walls, windows, and doors. Base your analysis on what you actually see in the photo.`
                            },
                            { inlineData: { data: base64Image, mimeType } },
                        ],
                    },
                ],
            }), 'Floor plan generation');

            const text = (result as any).candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanedText);

            logger.info('✅ Floor plan generated successfully');
            return {
                floorPlan: parsed.floorPlan || 'Floor plan not available',
                dimensions: parsed.dimensions || 'Dimensions not estimated',
                furniturePlacement: parsed.furniturePlacement || [],
            };
        } catch (error: any) {
            logger.error(`❌ Floor plan generation failed: ${error.message}`);
            return this.getLocalFloorPlan(roomType);
        }
    }

    private getLocalFloorPlan(roomType: string): { floorPlan: string; dimensions: string; furniturePlacement: string[] } {
        const plans: Record<string, { floorPlan: string; dimensions: string; furniturePlacement: string[] }> = {
            'Living Room': {
                floorPlan: `+------W------W------+\n|                    |\n|   [Sofa]           |\n|                    |\n|      [Table]       |\nD                    |\n|   [Chair]  [Lamp]  |\n|                    |\n+--------------------+`,
                dimensions: '14ft x 12ft / 4.2m x 3.6m',
                furniturePlacement: ['Sofa - facing windows on north wall', 'Coffee table - center of room', 'Accent chair - east corner', 'Floor lamp - beside chair'],
            },
            'Bedroom': {
                floorPlan: `+----W---------+\n|              |\n|    [Bed]     |\n|              |\nD   [Dresser]  |\n|              |\n|  [Wardrobe]  |\n+--------------+`,
                dimensions: '12ft x 10ft / 3.6m x 3.0m',
                furniturePlacement: ['Bed - centered on east wall', 'Nightstands - both sides of bed', 'Dresser - opposite bed', 'Wardrobe - south wall'],
            },
            'Kitchen': {
                floorPlan: `+----W---------+\n| [Stove][Sink]|\n|              |\n| [Counter]    |\nD              |\n| [Island]     |\n|              |\n+--------------+`,
                dimensions: '10ft x 12ft / 3.0m x 3.6m',
                furniturePlacement: ['Stove - north wall', 'Sink - beside stove under window', 'Counter - L-shaped along walls', 'Island - center with bar stools'],
            },
            'Study Room': {
                floorPlan: `+----W---------+\n|              |\n|   [Desk]     |\n|   [Chair]    |\nD              |\n| [Bookshelf]  |\n|              |\n+--------------+`,
                dimensions: '10ft x 8ft / 3.0m x 2.4m',
                furniturePlacement: ['Desk - facing window', 'Chair - at desk', 'Bookshelf - east wall', 'Lamp - on desk'],
            },
            'Bathroom': {
                floorPlan: `+----W----+\n| [Shower]|\n|         |\n| [Vanity]|\nD         |\n| [Toilet]|\n+---------+`,
                dimensions: '8ft x 6ft / 2.4m x 1.8m',
                furniturePlacement: ['Shower - north corner', 'Vanity - west wall with mirror', 'Toilet - south wall'],
            },
            'Dining Room': {
                floorPlan: `+------W------+\n|             |\n|  [Table]    |\n|  [Chairs]   |\nD             |\n|  [Cabinet]  |\n|             |\n+-------------+`,
                dimensions: '12ft x 10ft / 3.6m x 3.0m',
                furniturePlacement: ['Dining table - center of room', 'Chairs - 6 around table', 'Buffet cabinet - south wall', 'Chandelier - above table'],
            },
        };
        return plans[roomType] || plans['Living Room'];
    }
}

export const aiService = new AIService();

