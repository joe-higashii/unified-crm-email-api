//leadController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { createLead, getLeads, updateLead, deleteLead } from '../services/leadService';
import { StatusLead } from '@prisma/client';

const createLeadSchema = z.object({
  email: z.string().email("Email inválido"),
  nome: z.string().optional(),
  telefone: z.string().optional(),
  status: z.nativeEnum(StatusLead).optional(),
  integracaoId: z.string(),
  camposCustom: z.any().optional(),
});

const updateLeadSchema = createLeadSchema.partial();

export const createLeadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createLeadSchema.parse(req.body);
    const lead = await createLead(data);
    res.status(201).json({ message: 'Lead criado com sucesso!', lead });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#createLead' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar lead.', docs: '/api-docs/errors#createLead' });
    return;
  }
};

export const getLeadsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getLeads(page, limit);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter leads.', docs: '/api-docs/errors#getLeads' });
    return;
  }
};

export const updateLeadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateLeadSchema.parse(req.body);
    const lead = await updateLead(id, data);
    res.status(200).json({ message: 'Lead atualizado com sucesso!', lead });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', issues: error.errors, docs: '/api-docs/errors#updateLead' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar lead.', docs: '/api-docs/errors#updateLead' });
    return;
  }
};

export const deleteLeadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteLead(id);
    res.status(200).json({ message: 'Lead removido com sucesso!' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover lead.', docs: '/api-docs/errors#deleteLead' });
    return;
  }
};

