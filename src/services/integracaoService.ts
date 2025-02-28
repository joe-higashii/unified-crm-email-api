//integracaoService.ts

import prisma from '../config/database';
import { TipoIntegracao, ProvedorCRM } from '@prisma/client';

export interface IntegracaoData {
  tipo: TipoIntegracao;
  provedor: ProvedorCRM;
  modoTeste?: boolean;
  credenciais: string;
  usuarioId: string;
  sincronizadoEm?: Date;
  camposExtras?: any;
}

export const createIntegracao = async (data: IntegracaoData) => {
  // Verifica se já existe uma integração para o mesmo usuário e provedor
  const integracaoExistente = await prisma.integracao.findFirst({
    where: {
      usuarioId: data.usuarioId,
      provedor: data.provedor,
    },
  });
  if (integracaoExistente) {
    return integracaoExistente;
  }
  const integracao = await prisma.integracao.create({
    data,
  });
  return integracao;
};

export const getIntegracoes = async (page: number = 1, limit: number = 10, usuarioId: string) => {
  const skip = (page - 1) * limit;
  const integracoes = await prisma.integracao.findMany({
    where: { usuarioId },
    skip,
    take: limit,
    orderBy: { id: 'asc' },
  });
  const total = await prisma.integracao.count({ where: { usuarioId } });
  const totalPages = Math.ceil(total / limit);
  return { integracoes, total, totalPages, currentPage: page };
};

export const getIntegracaoById = async (id: string) => {
  const integracao = await prisma.integracao.findUnique({
    where: { id },
  });
  return integracao;
};

export const updateIntegracao = async (id: string, data: Partial<IntegracaoData>) => {
  const integracao = await prisma.integracao.update({
    where: { id },
    data,
  });
  return integracao;
};

export const deleteIntegracao = async (id: string) => {
  const integracao = await prisma.integracao.delete({
    where: { id },
  });
  return integracao;
};

