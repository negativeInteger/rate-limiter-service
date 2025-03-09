import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
    try {
        await prisma.$connect();
        console.log('Connected to Postgres !!!');
    } catch (err) {
        console.error('Postgres Connection error !!', err);
    }
})();

export { prisma };