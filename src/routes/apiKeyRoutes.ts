import { Router } from "express";
import { createApiKey, getAllApiKeys, updateApiKey, deleteApiKey } from '../controllers/apiKeyController';

const router = Router();

router.post('/create', createApiKey);
router.get('/', getAllApiKeys);
router.put('/:id', updateApiKey);
router.delete('/:id', deleteApiKey);

export default router;