//passwordResetService.ts

import prisma from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';

const TOKEN_EXPIRY_HOURS = 1;
const SALT_ROUNDS = 10;

export const requestPasswordReset = async (usuarioId: string): Promise<string> => {
  const token = uuidv4();
  const expiraEm = new Date();
  expiraEm.setHours(expiraEm.getHours() + TOKEN_EXPIRY_HOURS);
  await prisma.passwordResetToken.create({
    data: {
      usuarioId,
      token,
      expiraEm,
    },
  });
  return token;
};

export const resetPassword = async (token: string, novaSenha: string): Promise<void> => {
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usado || resetToken.expiraEm < new Date()) {
    throw new Error('Token inválido ou expirado.');
  }
  const senha_hash = await bcryptjs.hash(novaSenha, SALT_ROUNDS);
  await prisma.usuario.update({
    where: { id: resetToken.usuarioId },
    data: { senha_hash },
  });
  await prisma.passwordResetToken.update({
    where: { token },
    data: { usado: true },
  });
};

