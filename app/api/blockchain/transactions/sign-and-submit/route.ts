import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { signTransactionSchema } from '@/app/lib/cardano/transaction-validation';

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();

    // Validate request with Zod schema
    const validated = signTransactionSchema.parse(body);

    // Call backend API
    const response = await cardanoAPI.transactions.signAndSubmit({
      transaction_id: validated.transaction_id,
      password: validated.password,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error signing and submitting transaction:', error);

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle API errors
    if (error.status) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to sign and submit transaction' },
      { status: 500 }
    );
  }
}
