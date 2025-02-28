//relatorioController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import {
  createRelatorio,
  getRelatorios,
  getRelatorioById,
  updateRelatorio,
  deleteRelatorio,
} from '../services/relatorioService';

const relatorioSchema = z.object({
  campanhaId: z.string(),
  aberturas: z.number(),
  cliques: z.number(),
  rejeicoes: z.number(),
  timestamp: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date().optional()),
});

export const createRelatorioController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = relatorioSchema.parse(req.body);
    const relatorio = await createRelatorio(data);
    res.status(201).json({ message: 'Relatório criado com sucesso!', relatorio });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#createRelatorio' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar relatório.', docs: '/api-docs/errors#createRelatorio' });
    return;
  }
};

export const getRelatoriosController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getRelatorios(page, limit);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter relatórios.', docs: '/api-docs/errors#getRelatorios' });
    return;
  }
};

export const getRelatorioByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const relatorio = await getRelatorioById(id);
    if (!relatorio) {
      res.status(404).json({ error: 'Relatório não encontrado.', docs: '/api-docs/errors#getRelatorioById' });
      return;
    }
    res.status(200).json(relatorio);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter relatório.', docs: '/api-docs/errors#getRelatorioById' });
    return;
  }
};

export const updateRelatorioController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = relatorioSchema.partial().parse(req.body);
    const relatorio = await updateRelatorio(id, data);
    res.status(200).json({ message: 'Relatório atualizado com sucesso!', relatorio });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#updateRelatorio' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar relatório.', docs: '/api-docs/errors#updateRelatorio' });
    return;
  }
};

export const deleteRelatorioController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteRelatorio(id);
    res.status(200).json({ message: 'Relatório removido com sucesso!' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover relatório.', docs: '/api-docs/errors#deleteRelatorio' });
    return;
  }
};

