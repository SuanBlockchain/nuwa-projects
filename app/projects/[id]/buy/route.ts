import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type BuyBody = { wallet: string; amount: number };

function isBuyBody(x: unknown): x is BuyBody {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.wallet === "string" && typeof o.amount === "number";
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const bodyUnknown = await req.json();

    if (!isBuyBody(bodyUnknown)) {
      return NextResponse.json({ ok: false, error: "Body inválido" }, { status: 400 });
    }

    const { wallet, amount } = bodyUnknown;

    const holding = await prisma.holding.create({
      data: { projectId: id, wallet, amount },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, holdingId: holding.id, onChain: false });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
