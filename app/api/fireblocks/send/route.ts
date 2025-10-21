import { NextResponse } from "next/server";
import { fireblocks } from "@/app/lib/fireblocks";
import {
  TransactionOperation,
  PeerType,            
} from "fireblocks-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assetId, destinationAddress, amount, metadata } = body ?? {};

    const vaultAccountId = process.env.FIREBLOCKS_VAULT_ACCOUNT_ID!;
    if (!assetId || !destinationAddress || !amount) {
      return NextResponse.json(
        { error: "assetId, destinationAddress y amount son requeridos" },
        { status: 400 }
      );
    }

    const tx = await fireblocks.createTransaction({
      operation: TransactionOperation.TRANSFER,
      assetId,
      source: {
        type: PeerType.VAULT_ACCOUNT,    
        id: vaultAccountId,
      },
      destination: {
        type: PeerType.ONE_TIME_ADDRESS,  
        oneTimeAddress: { address: destinationAddress },
      },
      amount,
      note: JSON.stringify(metadata ?? {}),
      extraParameters: {
        customerRefId: metadata?.projectId || undefined,
      },
    });

    return NextResponse.json({ ok: true, tx });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
