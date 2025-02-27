//integracaoRoutes.ts

import { Router } from 'express';
import {
  createIntegracaoController,
  getIntegracoesController,
  getIntegracaoByIdController,
  updateIntegracaoController,
  deleteIntegracaoController,
} from '../controllers/integracaoController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, createIntegracaoController);
router.get('/', authenticate, getIntegracoesController);
router.get('/:id', authenticate, getIntegracaoByIdController);
router.patch('/:id', authenticate, updateIntegracaoController);
router.delete('/:id', authenticate, deleteIntegracaoController);

export default router;
