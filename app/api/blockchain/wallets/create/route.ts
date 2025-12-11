import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { createWalletSchema } from '@/app/lib/cardano/validation';

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const validated = createWalletSchema.parse(body);
    const { name, password } = validated;

    const wallet = await cardanoAPI.wallets.create({ name, password });

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}
