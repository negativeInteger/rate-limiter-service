import { Request, Response } from "express";
import { apiKeyService, PlanType } from "../services/apiKeyService";

export const apiKeyController = {
    async create(req: Request, res: Response) {
        const { owner, plan } = req.body;
        if (!owner || !plan) {
            res.status(400).json({ message: "Owner and plan required" });
            return;
        }
        if (!Object.values(PlanType).includes(plan)) {
            res.status(400).json({ message: "Invalid plan type" });
            return;
        }
        const apiKey = await apiKeyService.createApiKey(owner, plan as PlanType);
        res.json({ message: "API Key Created", apiKey });
    },
    async list(req: Request, res: Response) {
        const apiKeys = await apiKeyService.getApiKeys();
        res.json(apiKeys);
    },
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try{
            await apiKeyService.deleteApiKey(id);
            res.json({ message: 'API Key deleted' })
        } catch (err) {
            res.status(404).json({ message: 'API Key not found' })
        }
    }
};