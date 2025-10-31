-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "supplyTotal" INTEGER;

-- CreateTable
CREATE TABLE "ProjectToken" (
    "id" TEXT NOT NULL,
    "projectId" UUID NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "address" TEXT,
    "network" TEXT,

    CONSTRAINT "ProjectToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holding" (
    "id" TEXT NOT NULL,
    "projectId" UUID NOT NULL,
    "wallet" TEXT NOT NULL,
    "amount" DECIMAL(65,18) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectToken_projectId_key" ON "ProjectToken"("projectId");

-- CreateIndex
CREATE INDEX "Holding_wallet_idx" ON "Holding"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_wallet_key" ON "Whitelist"("wallet");

-- AddForeignKey
ALTER TABLE "ProjectToken" ADD CONSTRAINT "ProjectToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
