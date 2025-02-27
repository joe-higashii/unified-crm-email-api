//leadRoutes.ts

import { Router } from 'express';
import { createLeadController, getLeadsController } from '../controllers/leadController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Rotas protegidas para leads
router.post('/', authenticate, createLeadController);
router.get('/', authenticate, getLeadsController);

export default router;

