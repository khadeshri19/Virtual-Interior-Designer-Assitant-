export declare const redis: any;
export declare function cacheGet<T>(key: string): Promise<T | null>;
export declare function cacheSet(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
export declare function cacheDelete(key: string): Promise<void>;
export declare function cacheInvalidatePattern(pattern: string): Promise<void>;
//# sourceMappingURL=redis.d.ts.map