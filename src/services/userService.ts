//userService.ts

import prisma from '../config/database';

export const getUserById = async (id: string) => {
  const user = await prisma.usuario.findUnique({ where: { id } });
  return user;
};

export const updateUser = async (id: string, data: { nome?: string; email?: string }) => {
  const user = await prisma.usuario.update({
    where: { id },
    data,
  });
  return user;
};

