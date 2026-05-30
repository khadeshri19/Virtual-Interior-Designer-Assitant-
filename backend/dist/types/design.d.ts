export interface CreateDesignInput {
    userId: string;
    originalImage: string;
    style: string;
    roomType: string;
    budget?: number;
    dimensions?: string;
    metadata?: Record<string, any>;
}
export interface UpdateDesignInput {
    generatedImages?: string[];
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    prompt?: string;
    metadata?: Record<string, any>;
}
export interface DesignFilters {
    userId?: string;
    status?: string;
    style?: string;
    roomType?: string;
}
export interface DesignResponse {
    id: string;
    userId: string;
    originalImage: string;
    generatedImages: string[];
    style: string;
    roomType: string;
    budget: number | null;
    dimensions: string | null;
    status: string;
    prompt: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface GenerateDesignRequest {
    style: string;
    roomType: string;
    budget?: number;
    dimensions?: string;
}
export declare const SUPPORTED_STYLES: readonly ["Modern", "Minimalist", "Scandinavian", "Industrial", "Luxury", "Traditional", "Bohemian", "Mid-Century Modern", "Coastal", "Farmhouse"];
export declare const SUPPORTED_ROOM_TYPES: readonly ["Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Home Office", "Kids Room", "Outdoor Patio"];
export type SupportedStyle = typeof SUPPORTED_STYLES[number];
export type SupportedRoomType = typeof SUPPORTED_ROOM_TYPES[number];
//# sourceMappingURL=design.d.ts.map