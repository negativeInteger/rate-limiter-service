import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { prisma } from "../config/prisma";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Get API Key from the request header
        const apiKey = req.header('x-api-key') as string;
        if (!apiKey) {
            res.status(401).json({ error: 'API Key is missing' });
            return;
        }
        // Validate API in PostgreSQL
        const apiKeyData = await prisma.apiKey.findUnique({
            where: { key: apiKey }
        });
        if (!apiKeyData) {
            res.status(403).json({ error: 'Invalid API' });
            return;
        }

        const { rateLimit } = apiKeyData; 
        const redisKey = `ratelimit:${apiKey}`;
        const now = Date.now();
        const oneMinuteAgo = now - 60 * 1000; // now - 6000ms(60s)
    try {
        // Remove expired request timestamps(older than 60s)
        await redis.zRemRangeByScore(redisKey, 0, oneMinuteAgo);
        // Get the current request count
        const requestCount = await redis.zCard(redisKey);
        if(requestCount >= rateLimit) {
            res.status(429).json({ error: 'Rate limit exceeded. Try again later' })
        }
        // Add current request timestamp
        await redis.zAdd(redisKey, [{ score: now, value: now.toString() }]);
        // Reset expiry time
        await redis.expire(redisKey, 60);
        next(); // Allow request to proceed
    } catch (err) {
        console.error('Rate Limiter Error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

