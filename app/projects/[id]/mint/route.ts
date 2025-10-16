import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Next 15: params es una Promise
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // Lee el proyecto
  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, supplyTotal: true },
  });
  if (!project) {
    return NextResponse.json({ ok: false, error: "Proyecto no encontrado" }, { status: 404 });
  }

  // Lógica demo de “mint”: incrementa el supply en 1000
  const newSupply = (project.supplyTotal ?? 0) + 1000;

  const updated = await prisma.project.update({
    where: { id },
    data: { supplyTotal: newSupply },
    select: { id: true, supplyTotal: true },
  });

  // Devuelve JSON (¡no HTML!)
  return NextResponse.json({
    ok: true,
    onChain: false,      // cambia a true si luego conectas blockchain
    txHash: null,        // puedes completar después
    supplyTotal: updated.supplyTotal,
  });
}
