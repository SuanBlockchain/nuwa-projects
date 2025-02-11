// app/api/getSpecies/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const speciesList = await prisma.species.findMany({
      select: { common_name: true }, // Adjust based on your database schema
    });

    return NextResponse.json(speciesList.map((species) => species.common_name));
  } catch (error) {
    console.error('Error fetching species:', error);
    return NextResponse.json(
      { error: 'Failed to fetch species.' },
      { status: 500 }
    );
  }
}
