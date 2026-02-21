-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('HIRING', 'HELPDESK');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "clientSlug" TEXT NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "notionWorkspaceId" TEXT,
    "notionBotId" TEXT,
    "notionAccessTokenEnc" TEXT,
    "notionTokenMeta" JSONB,
    "notionDbCandidatesId" TEXT,
    "notionDbRolesId" TEXT,
    "notionDbStagesId" TEXT,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "replyToEmail" TEXT,
    "logoUrl" TEXT,
    "monthlyEmailQuota" INTEGER NOT NULL DEFAULT 500,
    "emailsSentMonth" INTEGER NOT NULL DEFAULT 0,
    "emailsSentMonthKey" TEXT,
    "webhookSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientSlug_key" ON "Client"("clientSlug");

-- CreateIndex
CREATE INDEX "EventLog_clientId_createdAt_idx" ON "EventLog"("clientId", "createdAt");

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
