import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface ParcelData {
  species: string;
  bgb: number;
  co2_captured: number;
  agb: number;
  soc_total: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectIds } = body;

    if (!projectIds || projectIds.length === 0) {
      return NextResponse.json(
        { error: 'No species selected.' },
        { status: 400 }
      );
    }

    const parcelsData: ParcelData[] = await prisma.$queryRaw`
        SELECT species,
               SUM(parcel_bgb) AS bgb,
               SUM(parcel_co2eq_captured) AS co2_captured,
               SUM(parcel_agb) AS agb,
               SUM(parcel_soc_total) AS soc_total
          FROM parcels_agbs_calculations
         WHERE parcel_id IN (
                SELECT id
                  FROM "Parcels"
                 WHERE "projectId" = ANY(${projectIds}::uuid[]))
         GROUP BY species;
    `;

    const transformedData = parcelsData.map((parcel: ParcelData) => ({
      species: parcel.species,
      bgb: parcel.bgb,
      co2_captured: parcel.co2_captured,
      agb: parcel.agb,
      soc_total: parcel.soc_total
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch growth data.' }, { status: 500 });
  }
}