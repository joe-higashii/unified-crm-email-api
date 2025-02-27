//passwordResetController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { requestPasswordReset, resetPassword } from '../services/passwordResetService';

const requestSchema = z.object({
  usuarioId: z.string(),
});

const resetSchema = z.object({
  token: z.string(),
  novaSenha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const requestPasswordResetController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = requestSchema.parse(req.body);
    const token = await requestPasswordReset(data.usuarioId);
    res.status(200).json({ message: 'Token de reset gerado com sucesso!', token });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#passwordResetRequest' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao solicitar reset de senha.', docs: '/api-docs/errors#passwordResetRequest' });
    return;
  }
};

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = resetSchema.parse(req.body);
    await resetPassword(data.token, data.novaSenha);
    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#passwordReset' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao redefinir senha.', docs: '/api-docs/errors#passwordReset' });
    return;
  }
};

