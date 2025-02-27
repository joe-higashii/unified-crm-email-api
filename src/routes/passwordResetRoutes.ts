//passwordResetRoutes.ts

import { Router } from 'express';
import { requestPasswordResetController, resetPasswordController } from '../controllers/passwordResetController';

const router = Router();

router.post('/request', requestPasswordResetController);
router.post('/reset', resetPasswordController);

export default router;

