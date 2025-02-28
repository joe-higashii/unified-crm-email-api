//campanhaService.ts

import prisma from '../config/database';
import { StatusCampanha } from '@prisma/client';

export interface CampanhaData {
  nome: string;
  template: string;
  agendamento: Date;
  status?: StatusCampanha;
  integracaoId: string;
  parametros: any;
  modoTeste?: boolean;
}

export const createCampanha = async (data: CampanhaData) => {
  const campanha = await prisma.campanha.create({
    data: {
      nome: data.nome,
      template: data.template,
      agendamento: data.agendamento,
      status: data.status,
      integracaoId: data.integracaoId,
      parametros: data.parametros ?? {},
      modoTeste: data.modoTeste ?? true,
    },
  });
  return campanha;
};

export const getCampanhas = async (page: number = 1, limit: number = 10, integracaoId?: string) => {
  const skip = (page - 1) * limit;
  const whereClause = integracaoId ? { integracaoId } : {};
  const campanhas = await prisma.campanha.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: { criadoEm: 'desc' },
  });
  const total = await prisma.campanha.count({ where: whereClause });
  const totalPages = Math.ceil(total / limit);
  return { campanhas, total, totalPages, currentPage: page };
};

export const getCampanhaById = async (id: string) => {
  const campanha = await prisma.campanha.findUnique({
    where: { id },
  });
  return campanha;
};

export const updateCampanha = async (id: string, data: Partial<CampanhaData>) => {
  const campanha = await prisma.campanha.update({
    where: { id },
    data,
  });
  return campanha;
};

export const deleteCampanha = async (id: string) => {
  const campanha = await prisma.campanha.delete({
    where: { id },
  });
  return campanha;
};

