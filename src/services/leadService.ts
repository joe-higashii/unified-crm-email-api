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
  const lead = await prisma.lead.create({
    data: leadData,
  });
  return lead;
};

export const getLeads = async () => {
  const leads = await prisma.lead.findMany();
  return leads;
};

export const updateLead = async (id: string, data: Partial<{
  email: string;
  nome?: string;
  telefone?: string;
  status?: StatusLead;
  camposCustom?: any;
}>) => {
  const lead = await prisma.lead.update({
    where: { id },
    data,
  });
  return lead;
};

export const deleteLead = async (id: string) => {
  await prisma.lead.delete({ where: { id } });
};

