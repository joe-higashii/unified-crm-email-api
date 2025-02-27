//leadRoutes.ts

import { Router } from 'express';
import { 
    createLeadController,
    getLeadsController,
    updateLeadController,
    deleteLeadController 
} from '../controllers/leadController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, createLeadController);
router.get('/', authenticate, getLeadsController);
router.patch('/:id', authenticate, updateLeadController);
router.delete('/:id', authenticate, deleteLeadController);

export default router;

