import { AxiosInstance } from 'axios';
export declare const comfyuiClient: AxiosInstance;
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
export declare function queuePrompt(workflow: ComfyUIWorkflow): Promise<ComfyUIResponse>;
export declare function getHistory(promptId: string): Promise<Record<string, unknown>>;
export declare function getImage(filename: string, subfolder?: string, type?: string): Promise<Buffer>;
export declare function checkHealth(): Promise<boolean>;
export declare function buildRedesignWorkflow(inputImagePath: string, style: string, roomType: string, budget?: number): ComfyUIWorkflow;
//# sourceMappingURL=comfyui.d.ts.map