import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
export declare class ChatController {
    sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getAllChats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    createChat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    deleteChat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getQuickSuggestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const chatController: ChatController;
//# sourceMappingURL=chatController.d.ts.map