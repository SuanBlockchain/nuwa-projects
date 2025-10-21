import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type MintBody = { amount: number };

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = (await req.json()) as Partial<MintBody>;
    const mintAmount = Number(body?.amount ?? 0);

    if (!Number.isFinite(mintAmount) || mintAmount <= 0) {
      return NextResponse.json({ ok: false, error: "amount inválido" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { supplyTotal: { increment: mintAmount } },
      select: { supplyTotal: true },
    });

    return NextResponse.json({
      ok: true,
      onChain: false,
      supplyTotal: updated.supplyTotal ?? 0,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}