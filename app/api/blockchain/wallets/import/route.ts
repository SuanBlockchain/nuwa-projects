import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { importWalletSchema } from '@/app/lib/cardano/validation';

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const validated = importWalletSchema.parse(body);
    const { name, mnemonic, password } = validated;

    const wallet = await cardanoAPI.wallets.import({ name, mnemonic, password });

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error importing wallet:', error);
    return NextResponse.json(
      { error: 'Failed to import wallet' },
      { status: 500 }
    );
  }
}
