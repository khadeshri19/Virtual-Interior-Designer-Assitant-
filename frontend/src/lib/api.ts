import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    timeout: 120000, // 2 minutes for AI generation
    headers: {
        'Content-Type': 'application/json',
        'X-User-Id': 'dev-user-001', // Default for dev environment
    },
});

// Design API
export interface CreateDesignRequest {
    image: File;
    style: string;
    roomType: string;
    budget?: number;
    dimensions?: string;
    lighting?: string;
    clutter?: string;
    colorScheme?: string;
}

export interface Design {
    id: string;
    userId: string;
    originalImage: string;
    generatedImages: string[];
    style: string;
    roomType: string;
    budget: number | null;
    dimensions: string | null;
    status: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

export interface DesignSuggestion {
    colorPalette: string[];
    furnitureRecommendations: string[];
    layoutTips: string[];
    estimatedBudget: { low: number; mid: number; high: number };
}

export const designApi = {
    create: async (data: CreateDesignRequest): Promise<Design> => {
        const formData = new FormData();
        formData.append('image', data.image);
        formData.append('style', data.style);
        formData.append('roomType', data.roomType);
        if (data.budget) formData.append('budget', data.budget.toString());
        if (data.dimensions) formData.append('dimensions', data.dimensions);
        if (data.lighting) formData.append('lighting', data.lighting);
        if (data.clutter) formData.append('clutter', data.clutter);
        if (data.colorScheme) formData.append('colorScheme', data.colorScheme);

        const response = await api.post('/api/designs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    generate: async (designId: string): Promise<Design> => {
        const response = await api.post(`/api/designs/${designId}/generate`);
        return response.data.data;
    },

    getById: async (designId: string): Promise<Design> => {
        const response = await api.get(`/api/designs/${designId}`);
        return response.data.data;
    },

    getAll: async (page = 1, limit = 10): Promise<{ designs: Design[], pagination: any }> => {
        const response = await api.get('/api/designs', { params: { page, limit } });
        return response.data.data;
    },

    delete: async (designId: string): Promise<void> => {
        await api.delete(`/api/designs/${designId}`);
    },

    getSuggestions: async (style: string, roomType: string, budget?: number): Promise<DesignSuggestion> => {
        const response = await api.get('/api/designs/suggestions', {
            params: { style, roomType, budget },
        });
        return response.data.data;
    },

    getGallery: async (limit = 12): Promise<Design[]> => {
        const response = await api.get('/api/designs/gallery', { params: { limit } });
        return response.data.data;
    },

    getOptions: async (): Promise<{ styles: string[], roomTypes: string[] }> => {
        const response = await api.get('/api/designs/options');
        return response.data.data;
    },

    getFloorPlan: async (designId: string): Promise<{ floorPlan: string; dimensions: string; furniturePlacement: string[] }> => {
        const response = await api.get(`/api/designs/${designId}/floorplan`);
        return response.data.data;
    },
};

// Chat API
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatContext {
    style?: string;
    roomType?: string;
    budget?: number;
}

export const chatApi = {
    sendMessage: async (
        message: string,
        chatId?: string,
        context?: ChatContext
    ): Promise<{ chatId: string; message: ChatMessage }> => {
        const response = await api.post('/api/chat/message', {
            message,
            chatId,
            context,
        });
        return response.data.data;
    },

    getHistory: async (chatId: string): Promise<{ messages: ChatMessage[] }> => {
        const response = await api.get(`/api/chat/${chatId}`);
        return response.data.data;
    },

    getAllChats: async (page = 1, limit = 10): Promise<any> => {
        const response = await api.get('/api/chat', { params: { page, limit } });
        return response.data.data;
    },

    createChat: async (context?: ChatContext): Promise<{ chatId: string }> => {
        const response = await api.post('/api/chat', { context });
        return response.data.data;
    },

    deleteChat: async (chatId: string): Promise<void> => {
        await api.delete(`/api/chat/${chatId}`);
    },

    getQuickSuggestions: async (
        style?: string,
        roomType?: string,
        budget?: number
    ): Promise<DesignSuggestion> => {
        const response = await api.get('/api/chat/quick/suggestions', {
            params: { style, roomType, budget },
        });
        return response.data.data;
    },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; services: Record<string, any> }> => {
    const response = await api.get('/health');
    return response.data;
};

export default api;
