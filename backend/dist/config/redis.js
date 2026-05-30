import Redis from 'ioredis';
import { logger } from '../utils/logger.js';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RedisConstructor = Redis.default || Redis;
export const redis = new RedisConstructor(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
        if (times > 3) {
            logger.error('Redis connection failed after 3 retries');
            return null;
        }
        return Math.min(times * 200, 1000);
    },
});
redis.on('connect', () => {
    logger.info('✅ Redis connected successfully');
});
redis.on('error', (err) => {
    logger.error('❌ Redis connection error:', err);
});
export async function cacheGet(key) {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        logger.error(`Cache get error for key ${key}:`, error);
        return null;
    }
}
export async function cacheSet(key, value, ttlSeconds = 3600) {
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
    }
    catch (error) {
        logger.error(`Cache set error for key ${key}:`, error);
    }
}
export async function cacheDelete(key) {
    try {
        await redis.del(key);
    }
    catch (error) {
        logger.error(`Cache delete error for key ${key}:`, error);
    }
}
export async function cacheInvalidatePattern(pattern) {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
    catch (error) {
        logger.error(`Cache invalidate pattern error for ${pattern}:`, error);
    }
}
//# sourceMappingURL=redis.js.map