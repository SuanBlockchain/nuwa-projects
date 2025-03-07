-- CreateEnum
CREATE TYPE "AnalysisType" AS ENUM ('MANUAL', 'ML');

-- AlterTable
ALTER TABLE "Parcels" ALTER COLUMN "area" DROP NOT NULL,
ALTER COLUMN "area_factor" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "ParcelAnalysis" (
    "id" UUID NOT NULL,
    "parcelId" UUID NOT NULL,
    "analysisType" "AnalysisType" NOT NULL DEFAULT 'ML',
    "values" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParcelAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParcelAnalysis" ADD CONSTRAINT "ParcelAnalysis_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
