import { Router } from "express";
import { apiKeyController } from "../controllers/apiKeyController";

const router = Router();

router.post('/create', apiKeyController.create);
router.get('/', apiKeyController.list);
router.delete('/:id', apiKeyController.delete);

export { router as apiKeyRouter };