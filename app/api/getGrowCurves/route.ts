// app/api/querySpecies/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { species } = body;

    if (!species) {
      return NextResponse.json({ error: 'Species is required.' }, { status: 400 });
    }

    const growthData = await prisma.$queryRaw`
      SELECT * FROM generate_species_data(${species}::text, 10);
    `;

    return NextResponse.json(growthData);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch growth data.' }, { status: 500 });
  }
}
