import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type UpsertBody = {
  projectId: string;
  token: { symbol: string; decimals: number; address: string; network?: string };
  balances: { address: string; formatted: string }[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UpsertBody;
    const { projectId, token, balances } = body;

    await prisma.projectToken.upsert({
      where: { projectId },
      create: {
        projectId,
        symbol: token.symbol,
        decimals: token.decimals,
        address: token.address,
        network: token.network ?? process.env.NETWORK_NAME ?? "bsc-testnet"
      },
      update: {
        symbol: token.symbol,
        decimals: token.decimals,
        address: token.address,
        network: token.network ?? process.env.NETWORK_NAME ?? "bsc-testnet"
      }
    });

    // Si definiste @@unique([projectId, wallet]) en Holding:
    // where: { projectId_wallet: { projectId, wallet: b.address } }
    for (const b of balances) {
      
      await prisma.holding.upsert({
        where: { id: `${projectId}_${b.address}`.toLowerCase() },
        create: {
          id: `${projectId}_${b.address}`.toLowerCase(),
          projectId,
          wallet: b.address,
          amount: b.formatted // o usa Decimal.js si tipeas estricto
        },
        update: { amount: b.formatted as unknown as 0 }
      });
    }

    return NextResponse.json({ ok: true, saved: balances.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
