//campanhaController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { CampanhaData, createCampanha, getCampanhas, getCampanhaById, updateCampanha, deleteCampanha } from '../services/campanhaService';
import { StatusCampanha } from '@prisma/client';

const campanhaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  template: z.string().min(1, "Template é obrigatório"),
  agendamento: z.preprocess(arg => new Date(arg as string), z.date()),
  status: z.nativeEnum(StatusCampanha).optional(),
  integracaoId: z.string(),
  parametros: z.any().default({}),
  modoTeste: z.boolean().optional(),
});

export const createCampanhaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = campanhaSchema.parse(req.body) as CampanhaData;
    const campanha = await createCampanha(data);
    res.status(201).json({ message: 'Campanha criada com sucesso!', campanha });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#createCampanha' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar campanha.', docs: '/api-docs/errors#createCampanha' });
    return;
  }
};

export const getCampanhasController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { campanhas, total, totalPages, currentPage } = await getCampanhas(page, limit, req.query.integracaoId as string | undefined);
    res.status(200).json({ campanhas, total, totalPages, currentPage });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter campanhas.', docs: '/api-docs/errors#getCampanhas' });
    return;
  }
};

export const getCampanhaByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const campanha = await getCampanhaById(id);
    if (!campanha) {
      res.status(404).json({ error: 'Campanha não encontrada.', docs: '/api-docs/errors#getCampanhaById' });
      return;
    }
    res.status(200).json(campanha);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter campanha.', docs: '/api-docs/errors#getCampanhaById' });
    return;
  }
};

export const updateCampanhaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = campanhaSchema.partial().parse(req.body);
    const campanha = await updateCampanha(id, data);
    res.status(200).json({ message: 'Campanha atualizada com sucesso!', campanha });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#updateCampanha' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar campanha.', docs: '/api-docs/errors#updateCampanha' });
    return;
  }
};

export const deleteCampanhaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteCampanha(id);
    res.status(200).json({ message: 'Campanha removida com sucesso!' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover campanha.', docs: '/api-docs/errors#deleteCampanha' });
    return;
  }
};

