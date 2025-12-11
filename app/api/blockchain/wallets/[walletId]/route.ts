import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    await requireAdmin();
    const { walletId } = await params;
    await cardanoAPI.wallets.delete(walletId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to delete wallet' },
      { status: 500 }
    );
  }
}
