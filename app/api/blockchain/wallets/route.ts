import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';

export async function GET() {
  try {
    await requireAuth();

    // Get wallets from Cardano backend
    // The backend already includes owner information and filters by user role
    const backendResponse = await cardanoAPI.wallets.list();

    return NextResponse.json(backendResponse.wallets);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets' },
      { status: 500 }
    );
  }
}
