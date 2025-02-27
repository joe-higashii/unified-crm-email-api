//userRoutes.ts

import { Router } from 'express';
import { getUserProfileController, updateUserProfileController } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', authenticate, getUserProfileController);
router.patch('/me', authenticate, updateUserProfileController);

export default router;

