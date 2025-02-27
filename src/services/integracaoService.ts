//integracaoService.ts

import prisma from '../config/database';
import { TipoIntegracao, ProvedorCRM } from '@prisma/client';

interface IntegracaoData {
  tipo: TipoIntegracao;
  provedor: ProvedorCRM;
  modoTeste?: boolean;
  credenciais: string;
  usuarioId: string;
  sincronizadoEm?: Date;
  camposExtras?: any;
}

export const createIntegracao = async (data: IntegracaoData) => {
  const integracao = await prisma.integracao.create({
    data: {
      tipo: data.tipo,
      provedor: data.provedor,
      modoTeste: data.modoTeste ?? true,
      credenciais: data.credenciais,
      usuarioId: data.usuarioId,
      sincronizadoEm: data.sincronizadoEm,
      camposExtras: data.camposExtras,
    },
  });
  return integracao;
};

export const getIntegracoes = async (usuarioId: string) => {
  const integracoes = await prisma.integracao.findMany({
    where: { usuarioId },
  });
  return integracoes;
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

