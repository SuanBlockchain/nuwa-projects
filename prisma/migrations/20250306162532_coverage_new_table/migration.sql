-- CreateEnum
CREATE TYPE "Index" AS ENUM ('NDVI', 'NDWI', 'SAVI', 'OSAVI');

-- CreateTable
CREATE TABLE "Coverage" (
    "id" UUID NOT NULL,
    "ecosystemId" UUID,
    "description" TEXT,
    "type" TEXT,
    "index" "Index" NOT NULL DEFAULT 'NDVI',
    "values" JSONB NOT NULL,

    CONSTRAINT "Coverage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coverage" ADD CONSTRAINT "Coverage_ecosystemId_fkey" FOREIGN KEY ("ecosystemId") REFERENCES "Ecosystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
