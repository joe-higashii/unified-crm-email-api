//userController.ts

import { Response } from 'express';
import { z } from 'zod';
import { getUserById, updateUser } from '../services/userService';
import { AuthRequest } from '../middlewares/authMiddleware';

const updateUserSchema = z.object({
  nome: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
});

export const getUserProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Não autorizado.', docs: '/api-docs/errors#profile' });
      return;
    }
    const user = await getUserById(userId);
    res.status(200).json(user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter perfil.', docs: '/api-docs/errors#profile' });
    return;
  }
};

export const updateUserProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Não autorizado.', docs: '/api-docs/errors#profile' });
      return;
    }
    const data = updateUserSchema.parse(req.body);
    const user = await updateUser(userId, data);
    res.status(200).json({ message: 'Perfil atualizado com sucesso!', user });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#updateProfile' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar perfil.', docs: '/api-docs/errors#updateProfile' });
    return;
  }
};

