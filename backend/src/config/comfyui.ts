import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger.js';

const COMFYUI_URL = process.env.COMFYUI_URL || 'http://localhost:8188';

export const comfyuiClient: AxiosInstance = axios.create({
    baseURL: COMFYUI_URL,
    timeout: 300000, // 5 minutes for image generation
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ComfyUIWorkflow {
    prompt: Record<string, unknown>;
    client_id?: string;
}

export interface ComfyUIResponse {
    prompt_id: string;
    number: number;
}

export interface ComfyUIImage {
    filename: string;
    subfolder: string;
    type: string;
}

export async function queuePrompt(workflow: ComfyUIWorkflow): Promise<ComfyUIResponse> {
    try {
        const response = await comfyuiClient.post('/prompt', workflow);
        return response.data;
    } catch (error) {
        logger.error('ComfyUI queue prompt error:', error);
        throw error;
    }
}

export async function getHistory(promptId: string): Promise<Record<string, unknown>> {
    try {
        const response = await comfyuiClient.get(`/history/${promptId}`);
        return response.data;
    } catch (error) {
        logger.error('ComfyUI get history error:', error);
        throw error;
    }
}

export async function getImage(
    filename: string,
    subfolder: string = '',
    type: string = 'output'
): Promise<Buffer> {
    try {
        const response = await comfyuiClient.get('/view', {
            params: { filename, subfolder, type },
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data);
    } catch (error) {
        logger.error('ComfyUI get image error:', error);
        throw error;
    }
}

export async function checkHealth(): Promise<boolean> {
    try {
        await comfyuiClient.get('/system_stats');
        return true;
    } catch (error) {
        logger.warn('ComfyUI not available');
        return false;
    }
}

// Build img2img workflow for room redesign
export function buildRedesignWorkflow(
    inputImagePath: string,
    style: string,
    roomType: string,
    budget?: number
): ComfyUIWorkflow {
    const budgetDescription = budget
        ? budget < 5000 ? 'budget-friendly'
            : budget < 15000 ? 'mid-range'
                : 'luxury high-end'
        : 'mid-range';

    const prompt = `Redesign this ${roomType.toLowerCase()} in a ${style.toLowerCase()} style, ${budgetDescription} furniture, keep original layout and architecture, photorealistic, natural lighting, 8k quality, interior design magazine photo`;

    return {
        prompt: {
            "3": {
                "inputs": {
                    "seed": Math.floor(Math.random() * 1000000),
                    "steps": 20,
                    "cfg": 7,
                    "sampler_name": "euler_ancestral",
                    "scheduler": "normal",
                    "denoise": 0.75,
                    "model": ["4", 0],
                    "positive": ["6", 0],
                    "negative": ["7", 0],
                    "latent_image": ["12", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": "sd_xl_base_1.0.safetensors"
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "6": {
                "inputs": {
                    "text": prompt,
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "7": {
                "inputs": {
                    "text": "ugly, blurry, low quality, distorted, watermark, text, unrealistic, cartoon, anime",
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "8": {
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["4", 2]
                },
                "class_type": "VAEDecode"
            },
            "9": {
                "inputs": {
                    "filename_prefix": "vd_redesign",
                    "images": ["8", 0]
                },
                "class_type": "SaveImage"
            },
            "11": {
                "inputs": {
                    "image": inputImagePath
                },
                "class_type": "LoadImage"
            },
            "12": {
                "inputs": {
                    "pixels": ["11", 0],
                    "vae": ["4", 2]
                },
                "class_type": "VAEEncode"
            }
        }
    };
}
