export declare class AIService {
    private ai;
    private geminiAvailable;
    private replicate;
    private replicateAvailable;
    private hf;
    private hfAvailable;
    constructor();
    checkServices(): Promise<{
        gemini: boolean;
        replicate: boolean;
        huggingface: boolean;
        imageModel: string;
        replicateModel: string;
        hfImageModel: string;
        textModel: string;
        database: string;
        providers: (string | false)[];
        status: string;
    }>;
    private withRetry;
    private buildRedesignPrompt;
    private buildReplicatePrompt;
    private buildPix2PixPrompt;
    generateRoomRedesign(inputImagePath: string, style: string, roomType: string, budget?: number, count?: number): Promise<string[]>;
    private generateWithGemini;
    private generateWithReplicate;
    private generateWithHuggingFace;
    private blobToBase64;
    private loadInputImage;
    private saveGeneratedImage;
    private downloadAndSaveImage;
    private getFallbackImages;
    consultDesign(style: string, roomType: string, preferences: string): Promise<string>;
    private getLocalConsultation;
    generateDesignSuggestions(roomType: string, style: string): Promise<string[]>;
}
export declare const aiService: AIService;
//# sourceMappingURL=aiService.d.ts.map