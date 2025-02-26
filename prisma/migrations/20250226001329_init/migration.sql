--migration.sql
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "PlanoUsuario" AS ENUM ('GRATIS', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'API');

-- CreateEnum
CREATE TYPE "TipoIntegracao" AS ENUM ('CRM', 'EMAIL_MARKETING');

-- CreateEnum
CREATE TYPE "ProvedorCRM" AS ENUM ('SALESFORCE', 'ZOHO_CRM', 'PIPEDRIVE', 'HUBSPOT');

-- CreateEnum
CREATE TYPE "ProvedorEmail" AS ENUM ('ZOHO_CAMPAIGNS', 'MAILCHIMP', 'SENDGRID');

-- CreateEnum
CREATE TYPE "StatusLead" AS ENUM ('NOVO', 'CONTATADO', 'CONVERTIDO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusCampanha" AS ENUM ('RASCUNHO', 'AGENDADA', 'ENVIANDO', 'ENVIADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "plano" "PlanoUsuario" NOT NULL DEFAULT 'GRATIS',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integracoes" (
    "id" TEXT NOT NULL,
    "tipo" "TipoIntegracao" NOT NULL,
    "provedor" "ProvedorCRM" NOT NULL,
    "modoTeste" BOOLEAN NOT NULL DEFAULT true,
    "credenciais" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "sincronizadoEm" TIMESTAMP(3),
    "camposExtras" JSONB,

    CONSTRAINT "integracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nome" TEXT,
    "telefone" TEXT,
    "status" "StatusLead" NOT NULL DEFAULT 'NOVO',
    "integracaoId" TEXT NOT NULL,
    "camposCustom" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campanhas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "agendamento" TIMESTAMP(3) NOT NULL,
    "status" "StatusCampanha" NOT NULL DEFAULT 'RASCUNHO',
    "integracaoId" TEXT NOT NULL,
    "parametros" JSONB NOT NULL,
    "modoTeste" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campanhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_campanha" (
    "id" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "aberturas" INTEGER NOT NULL,
    "cliques" INTEGER NOT NULL,
    "rejeicoes" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metricas_campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "integracoes_tipo_modoTeste_idx" ON "integracoes"("tipo", "modoTeste");

-- CreateIndex
CREATE UNIQUE INDEX "integracoes_usuarioId_provedor_key" ON "integracoes"("usuarioId", "provedor");

-- CreateIndex
CREATE INDEX "idx_leads_email" ON "leads"("email");

-- CreateIndex
CREATE INDEX "idx_leads_status" ON "leads"("status");

-- CreateIndex
CREATE INDEX "idx_leads_integracao_status" ON "leads"("integracaoId", "status");

-- CreateIndex
CREATE INDEX "campanhas_status_agendamento_idx" ON "campanhas"("status", "agendamento");

-- CreateIndex
CREATE INDEX "metricas_campanha_campanhaId_timestamp_idx" ON "metricas_campanha"("campanhaId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_usuarioId_idx" ON "password_reset_tokens"("usuarioId");

-- AddForeignKey
ALTER TABLE "integracoes" ADD CONSTRAINT "integracoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_integracaoId_fkey" FOREIGN KEY ("integracaoId") REFERENCES "integracoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas" ADD CONSTRAINT "campanhas_integracaoId_fkey" FOREIGN KEY ("integracaoId") REFERENCES "integracoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricas_campanha" ADD CONSTRAINT "metricas_campanha_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "campanhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
