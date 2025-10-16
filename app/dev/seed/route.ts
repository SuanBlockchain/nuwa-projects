import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "demo@nuwa.test" },
      update: {},
      create: { email: "demo@nuwa.test", password: "demo", role: "ADMIN" },
    });

    const project = await prisma.project.create({
      data: {
        title: "Café Sierra Nevada",
        name: "cafe-sierra-nevada",
        creatorId: user.id,
        country: "CO",
        department: "Magdalena",
        status: "Seed",
        supplyTotal: 100000,
        description: "Tokenización de cultivo de café.",
        projectToken: { create: { symbol: "CAF", decimals: 18 } },
        holdings: {
          create: [
            { wallet: "0x111", amount: "2500" },
            { wallet: "0x222", amount: "1500" },
          ],
        },
      },
      include: { projectToken: true, holdings: true },
    });

    return NextResponse.json({ ok: true, project });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
