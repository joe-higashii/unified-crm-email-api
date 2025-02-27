//campanhaRoutes.ts

import { Router } from 'express';
import {
  createCampanhaController,
  getCampanhasController,
  getCampanhaByIdController,
  updateCampanhaController,
  deleteCampanhaController,
} from '../controllers/campanhaController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, createCampanhaController);
router.get('/', authenticate, getCampanhasController);
router.get('/:id', authenticate, getCampanhaByIdController);
router.patch('/:id', authenticate, updateCampanhaController);
router.delete('/:id', authenticate, deleteCampanhaController);

export default router;

