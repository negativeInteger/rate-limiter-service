import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { prisma } from "../config/prisma";

const WINDOW_SIZE_IN_SECONDS = 60;  // 1 minute - window

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get API Key from the request header
        const apiKey = req.header('api-key');
        if (!apiKey) {
            res.status(401).json({ error: 'API Key is missing' });
            return;
        }
        // Fetch the rate limit for this API key from PostgreSQL
        const apiKeyData = await prisma.apiKey.findUnique({
            where: { key: apiKey }
        });
        if (!apiKeyData) {
            res.status(403).json({ error: 'Invalid API' });
            return;
        }
        const { limit } = apiKeyData; // Max requests per minute
        // Generate a Redis Key for tracking requests
        const redisKey = `rate-limit:${apiKey}`;
        // Check Redis for existing request count
        const currentCount = await redis.get(redisKey);
        const requestCount = currentCount ? parseInt(currentCount) : 0;

        if (requestCount >= limit) {
            res.status(429).json({ error: 'Too many requests. Please try again later.' })
            return;
        }

        // Increment request count in Redis
        if (requestCount ===  0){
            // First request in the window - set expiry
            await redis.set(redisKey, '1', { EX: WINDOW_SIZE_IN_SECONDS });
        } else {
            await redis.incr(redisKey);
        }
        
        next(); // Allow request to proceed
    } catch (err) {
        console.error('Rate Limiter Error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

