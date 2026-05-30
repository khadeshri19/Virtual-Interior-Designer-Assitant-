import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
export declare const validate: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const designCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        style: z.ZodEnum<["Modern", "Minimalist", "Scandinavian", "Industrial", "Luxury", "Traditional", "Bohemian", "Mid-Century Modern", "Coastal", "Farmhouse"]>;
        roomType: z.ZodEnum<["Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Home Office", "Kids Room", "Outdoor Patio"]>;
        budget: z.ZodOptional<z.ZodNumber>;
        dimensions: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        style: "Modern" | "Minimalist" | "Scandinavian" | "Industrial" | "Luxury" | "Traditional" | "Bohemian" | "Mid-Century Modern" | "Coastal" | "Farmhouse";
        roomType: "Living Room" | "Bedroom" | "Kitchen" | "Dining Room" | "Bathroom" | "Home Office" | "Kids Room" | "Outdoor Patio";
        budget?: number | undefined;
        dimensions?: string | undefined;
    }, {
        style: "Modern" | "Minimalist" | "Scandinavian" | "Industrial" | "Luxury" | "Traditional" | "Bohemian" | "Mid-Century Modern" | "Coastal" | "Farmhouse";
        roomType: "Living Room" | "Bedroom" | "Kitchen" | "Dining Room" | "Bathroom" | "Home Office" | "Kids Room" | "Outdoor Patio";
        budget?: number | undefined;
        dimensions?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        style: "Modern" | "Minimalist" | "Scandinavian" | "Industrial" | "Luxury" | "Traditional" | "Bohemian" | "Mid-Century Modern" | "Coastal" | "Farmhouse";
        roomType: "Living Room" | "Bedroom" | "Kitchen" | "Dining Room" | "Bathroom" | "Home Office" | "Kids Room" | "Outdoor Patio";
        budget?: number | undefined;
        dimensions?: string | undefined;
    };
}, {
    body: {
        style: "Modern" | "Minimalist" | "Scandinavian" | "Industrial" | "Luxury" | "Traditional" | "Bohemian" | "Mid-Century Modern" | "Coastal" | "Farmhouse";
        roomType: "Living Room" | "Bedroom" | "Kitchen" | "Dining Room" | "Bathroom" | "Home Office" | "Kids Room" | "Outdoor Patio";
        budget?: number | undefined;
        dimensions?: string | undefined;
    };
}>;
export declare const chatMessageSchema: z.ZodObject<{
    body: z.ZodObject<{
        message: z.ZodString;
        context: z.ZodOptional<z.ZodObject<{
            style: z.ZodOptional<z.ZodString>;
            roomType: z.ZodOptional<z.ZodString>;
            budget: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            style?: string | undefined;
            roomType?: string | undefined;
            budget?: number | undefined;
        }, {
            style?: string | undefined;
            roomType?: string | undefined;
            budget?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        context?: {
            style?: string | undefined;
            roomType?: string | undefined;
            budget?: number | undefined;
        } | undefined;
    }, {
        message: string;
        context?: {
            style?: string | undefined;
            roomType?: string | undefined;
            budget?: number | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        context?: {
            style?: string | undefined;
            roomType?: string | undefined;
            budget?: number | undefined;
        } | undefined;
    };
}, {
    body: {
        message: string;
        context?: {
            style?: string | undefined;
            roomType?: string | undefined;
            budget?: number | undefined;
        } | undefined;
    };
}>;
export declare const paginationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        limit: string;
        page: string;
    }, {
        limit?: string | undefined;
        page?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: string;
        page: string;
    };
}, {
    query: {
        limit?: string | undefined;
        page?: string | undefined;
    };
}>;
//# sourceMappingURL=validate.d.ts.map