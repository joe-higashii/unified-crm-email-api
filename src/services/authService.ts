//authService.ts

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const registerUser = async (nome: string, email: string, senha: string) => {
  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email já cadastrado.');
  const senha_hash = await bcryptjs.hash(senha, SALT_ROUNDS);
  const user = await prisma.usuario.create({
    data: { nome, email, senha_hash },
  });
  return user;
};

export const loginUser = async (email: string, senha: string) => {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado.');
  const senhaValida = await bcryptjs.compare(senha, user.senha_hash);
  if (!senhaValida) throw new Error('Credenciais inválidas.');
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

