import { Request, Response } from "express";
import { prisma } from '../config/prisma';
import { randomBytes } from "crypto";

// Create a new API Key
export async function createApiKey(req: Request, res: Response) {
    try {
        const { limit } = req.body;
        if (!limit || typeof limit !== 'number') {
            return res.status(400).json('Invalid rate limit');
        }
        // Generate a random API Key (32 characters)
        const apiKey = randomBytes(16).toString("hex");
        // Store key in database
        const newKey = await prisma.apiKey.create({
            data: { key: apiKey, limit }
        })
        return res.status(201).json({ message: 'API Key generated', apiKey: newKey })
    } catch (err) {
        console.error('Error creating API Key', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get All API keys
export async function getAllApiKeys(req: Request, res: Response) {
    try {
        const apiKeys = await prisma.apiKey.findMany();
        res.json(apiKeys);
    } catch (err) {
        console.error('Error fetching API Keys', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update API Key rate limit
export async function updateApiKey(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { limit } = req.body;
        if (!limit || typeof limit !== 'number') {
            return res.status(400).json('Invalid rate limit');
        }
        const updatedApiKey = await prisma.apiKey.update({
            where: { id },
            data: { limit }
        })
        res.status(200).json({ message: 'API Key updated', updatedApiKey });
    } catch (err) {
        console.error('Error updating API Key', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
};

// Delete an API Key
export async function deleteApiKey(req: Request, res: Response) {
    try {
        const { id }  = req.params;
        await prisma.apiKey.delete({
            where: { id }
        });
        res.status(200).json({ message: 'API Key deleted' })
    } catch (err) {
        console.error('Error deleting API Key', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};