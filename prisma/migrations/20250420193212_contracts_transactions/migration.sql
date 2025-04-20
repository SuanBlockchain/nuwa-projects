/*
  Warnings:

  - Made the column `speciesId` on table `Parcels` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Parcels" DROP CONSTRAINT "Parcels_speciesId_fkey";

-- AlterTable
ALTER TABLE "Parcels" ALTER COLUMN "speciesId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Contracts" (
    "contractId" TEXT NOT NULL,
    "projectId" UUID,
    "contractName" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "contractAddress" TEXT,
    "compiledCode" JSONB NOT NULL,
    "tokenName" TEXT,
    "lockTxHash" TEXT,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("contractId")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "transactionId" TEXT NOT NULL,
    "contractId" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" BIGINT NOT NULL,
    "assets" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "lockedInContract" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_contractId_key" ON "Contracts"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionId_key" ON "Transactions"("transactionId");

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contracts"("contractId") ON DELETE CASCADE ON UPDATE CASCADE;
