//leadController.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { createLead, getLeads } from '../services/leadService';
import { StatusLead } from '@prisma/client';

// Esquema Zod para criação de lead
const createLeadSchema = z.object({
  email: z.string().email("Email inválido"),
  nome: z.string().optional(),
  telefone: z.string().optional(),
  status: z.nativeEnum(StatusLead).optional(),
  integracaoId: z.string(),
  camposCustom: z.any().optional(),
});

export const createLeadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createLeadSchema.parse(req.body);
    const lead = await createLead(data);
    res.status(201).json({ message: 'Lead criado com sucesso!', lead });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        issues: error.errors,
        docs: '/api-docs/errors#createLead'
      });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar lead.', docs: '/api-docs/errors#createLead' });
    return;
  }
};

export const getLeadsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const leads = await getLeads();
    res.status(200).json(leads);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter leads.', docs: '/api-docs/errors#getLeads' });
    return;
  }
};

// criar updateLead e deleteLead

