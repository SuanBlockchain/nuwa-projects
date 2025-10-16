/*
  Warnings:

  - You are about to alter the column `area` on the `Parcels` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,7)` to `Decimal(10,7)`.

*/
-- AlterTable
ALTER TABLE "public"."Parcels" ALTER COLUMN "area" SET DATA TYPE DECIMAL(10,7);

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "supplyTotal" INTEGER;

-- CreateTable
CREATE TABLE "public"."ProjectToken" (
    "id" TEXT NOT NULL,
    "projectId" UUID NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "address" TEXT,
    "network" TEXT,

    CONSTRAINT "ProjectToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Holding" (
    "id" TEXT NOT NULL,
    "projectId" UUID NOT NULL,
    "wallet" TEXT NOT NULL,
    "amount" DECIMAL(65,18) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Whitelist" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectToken_projectId_key" ON "public"."ProjectToken"("projectId");

-- CreateIndex
CREATE INDEX "Holding_wallet_idx" ON "public"."Holding"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_wallet_key" ON "public"."Whitelist"("wallet");

-- AddForeignKey
ALTER TABLE "public"."ProjectToken" ADD CONSTRAINT "ProjectToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Holding" ADD CONSTRAINT "Holding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
