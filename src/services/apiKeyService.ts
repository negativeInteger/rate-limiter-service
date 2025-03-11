import { prisma } from '../config/prisma';
import { randomBytes } from 'crypto';

export enum PlanType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM'
}


export const apiKeyService = {
    async createApiKey(owner: string, plan: PlanType) {
        const key = randomBytes(32).toString('hex'); // Secure 64-char API Ke
        const rateLimit = plan === PlanType.PREMIUM ? 10: 5;
        return await prisma.apiKey.create({
            data: { key, owner, plan, rateLimit }
        });
    },
    
    async getApiKeys() {
        return await prisma.apiKey.findMany();
    },

    async deleteApiKey(id: string) {
        return await prisma.apiKey.delete({ where: { id } })
    }
};
