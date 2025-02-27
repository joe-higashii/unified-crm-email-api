//integracaoController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import {
  createIntegracao,
  getIntegracoes,
  getIntegracaoById,
  updateIntegracao,
  deleteIntegracao,
} from '../services/integracaoService';
import { TipoIntegracao, ProvedorCRM } from '@prisma/client';

const integracaoSchema = z.object({
  tipo: z.nativeEnum(TipoIntegracao),
  provedor: z.nativeEnum(ProvedorCRM),
  modoTeste: z.boolean().optional(),
  credenciais: z.string(),
  usuarioId: z.string(),
  sincronizadoEm: z.preprocess(arg => arg ? new Date(arg as string) : undefined, z.date().optional()),
  camposExtras: z.any().optional(),
});

export const createIntegracaoController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = integracaoSchema.parse(req.body);
    const integracao = await createIntegracao(data);
    res.status(201).json({ message: 'Integração criada com sucesso!', integracao });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#createIntegracao' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar integração.', docs: '/api-docs/errors#createIntegracao' });
    return;
  }
};

export const getIntegracoesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuarioId } = req.query;
    if (!usuarioId || typeof usuarioId !== 'string') {
      res.status(400).json({ error: 'usuarioId é obrigatório como query param.', docs: '/api-docs/errors#getIntegracoes' });
      return;
    }
    const integracoes = await getIntegracoes(usuarioId);
    res.status(200).json(integracoes);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter integrações.', docs: '/api-docs/errors#getIntegracoes' });
    return;
  }
};

export const getIntegracaoByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const integracao = await getIntegracaoById(id);
    if (!integracao) {
      res.status(404).json({ error: 'Integração não encontrada.', docs: '/api-docs/errors#getIntegracaoById' });
      return;
    }
    res.status(200).json(integracao);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter integração.', docs: '/api-docs/errors#getIntegracaoById' });
    return;
  }
};

export const updateIntegracaoController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = integracaoSchema.partial().parse(req.body);
    const integracao = await updateIntegracao(id, data);
    res.status(200).json({ message: 'Integração atualizada com sucesso!', integracao });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#updateIntegracao' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar integração.', docs: '/api-docs/errors#updateIntegracao' });
    return;
  }
};

export const deleteIntegracaoController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteIntegracao(id);
    res.status(200).json({ message: 'Integração removida com sucesso!' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover integração.', docs: '/api-docs/errors#deleteIntegracao' });
    return;
  }
};

