//relatorioService.ts

import prisma from '../config/database';

export interface RelatorioData {
  campanhaId: string;
  aberturas: number;
  cliques: number;
  rejeicoes: number;
  timestamp?: Date;
}

export const createRelatorio = async (data: RelatorioData) => {
  const relatorio = await prisma.metricaCampanha.create({
    data: {
      campanhaId: data.campanhaId,
      aberturas: data.aberturas,
      cliques: data.cliques,
      rejeicoes: data.rejeicoes,
      timestamp: data.timestamp ?? new Date(),
    },
  });
  return relatorio;
};

export const getRelatorios = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const relatorios = await prisma.metricaCampanha.findMany({
    skip,
    take: limit,
    orderBy: { timestamp: 'desc' },
  });
  const total = await prisma.metricaCampanha.count();
  const totalPages = Math.ceil(total / limit);
  return { relatorios, total, totalPages, currentPage: page };
};

export const getRelatorioById = async (id: string) => {
  const relatorio = await prisma.metricaCampanha.findUnique({
    where: { id },
  });
  return relatorio;
};

export const updateRelatorio = async (id: string, data: Partial<RelatorioData>) => {
  const relatorio = await prisma.metricaCampanha.update({
    where: { id },
    data,
  });
  return relatorio;
};

export const deleteRelatorio = async (id: string) => {
  const relatorio = await prisma.metricaCampanha.delete({
    where: { id },
  });
  return relatorio;
};

