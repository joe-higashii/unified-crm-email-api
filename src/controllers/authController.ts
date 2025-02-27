//authController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser } from '../services/authService';

// Esquema Zod para validação do cadastro
const registerSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Esquema Zod para validação do login
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data.nome, data.email, data.senha);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: user });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        issues: error.errors,
        docs: '/api-docs/errors#register'
      });
      return;
    }
    if (error.message === 'Email já cadastrado.') {
      res.status(409).json({ error: error.message, docs: '/api-docs/errors#register' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao cadastrar usuário.', docs: '/api-docs/errors#register' });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const token = await loginUser(data.email, data.senha);
    res.status(200).json({ message: 'Login realizado com sucesso!', token });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        issues: error.errors,
        docs: '/api-docs/errors#login'
      });
      return;
    }
    if (error.message === 'Usuário não encontrado.' || error.message === 'Credenciais inválidas.') {
      res.status(401).json({ error: error.message, docs: '/api-docs/errors#login' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno durante o login.', docs: '/api-docs/errors#login' });
    return;
  }
};

