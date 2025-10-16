import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  if (!body || typeof body.wallet !== "string" || typeof body.amount !== "number") {
    return NextResponse.json({ ok: false, error: "Payload inválido" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
  if (!project) {
    return NextResponse.json({ ok: false, error: "Proyecto no encontrado" }, { status: 404 });
  }

  const holding = await prisma.holding.create({
    data: {
      projectId: id,
      wallet: body.wallet,
      amount: body.amount.toString(), // Prisma Decimal acepta string
    },
    select: { id: true },
  });

  return NextResponse.json({
    ok: true,
    holdingId: holding.id,
    onChain: false,
    txHash: null,
  });
}
