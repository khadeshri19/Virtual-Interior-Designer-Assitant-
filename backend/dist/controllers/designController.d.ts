import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
export declare class DesignController {
    create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    generate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getSuggestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getGallery(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getOptions(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export declare const designController: DesignController;
//# sourceMappingURL=designController.d.ts.map