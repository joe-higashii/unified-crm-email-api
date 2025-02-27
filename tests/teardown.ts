//teardown.ts

import prisma from '../src/config/database';

async function cleanDatabase() {
  // Trunca as tabelas em ordem (usando CASCADE para lidar com chaves estrangeiras)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "password_reset_tokens", "metricas_campanha", "campanhas", "leads", "integracoes", "usuarios" RESTART IDENTITY CASCADE;
  `);
}

export default async function globalTeardown() {
  await cleanDatabase();
  await prisma.$disconnect();
}

