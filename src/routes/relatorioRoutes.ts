//relatorioRoutes.ts

import { Router } from 'express';
import {
  createRelatorioController,
  getRelatoriosController,
  getRelatorioByIdController,
  updateRelatorioController,
  deleteRelatorioController,
} from '../controllers/relatorioController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, createRelatorioController);
router.get('/', authenticate, getRelatoriosController);
router.get('/:id', authenticate, getRelatorioByIdController);
router.patch('/:id', authenticate, updateRelatorioController);
router.delete('/:id', authenticate, deleteRelatorioController);

export default router;

