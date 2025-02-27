//leadService.ts

import prisma from '../config/database';
import { StatusLead } from '@prisma/client';

export const createLead = async (leadData: {
  email: string;
  nome?: string;
  telefone?: string;
  status?: StatusLead;
  integracaoId: string;
  camposCustom?: any;
}) => {
  // Se o status não for informado, o banco já aplicará o padrão definido no schema
  const lead = await prisma.lead.create({
    data: leadData,
  });
  return lead;
};

export const getLeads = async () => {
  const leads = await prisma.lead.findMany();
  return leads;
};

