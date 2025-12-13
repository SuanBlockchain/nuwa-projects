import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { importWalletSchema } from '@/app/lib/cardano/validation';
import { createWalletRecord } from '@/app/actions/wallet-actions';

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();

    const validated = importWalletSchema.parse(body);
    const { name, mnemonic, password } = validated;

    // Import wallet in backend
    const wallet = await cardanoAPI.wallets.import({ name, mnemonic, password });

    // Save ownership in local database
    await createWalletRecord(
      wallet.wallet_id,
      name,
      wallet.enterprise_address || '',
      wallet.network || 'preview'
    );

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error importing wallet:', error);
    return NextResponse.json(
      { error: 'Failed to import wallet' },
      { status: 500 }
    );
  }
}
