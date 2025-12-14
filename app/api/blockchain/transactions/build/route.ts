import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { buildTransactionSchema } from '@/app/lib/cardano/transaction-validation';
import type { BuildTransactionRequest } from '@/app/lib/cardano/transaction-types';

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();

    // Validate request with Zod schema
    const validated = buildTransactionSchema.parse(body);

    // Transform to backend API format
    const request: any = {
      to_address: validated.to_address,
      amount_ada: validated.amount_ada,
      from_address_index: validated.from_address_index,
    };

    // Add metadata based on mode
    // Backend expects: { "metadata": { "msg": "text" } } for text mode
    // Backend expects: { "metadata": { ...jsonData } } for json mode
    if (validated.metadata_mode === 'text' && validated.text_message) {
      request.metadata = {
        msg: validated.text_message,
      };
    } else if (validated.metadata_mode === 'json' && validated.json_data) {
      try {
        const jsonData = JSON.parse(validated.json_data);
        request.metadata = jsonData;
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid JSON metadata' },
          { status: 400 }
        );
      }
    }

    // Call backend API
    const response = await cardanoAPI.transactions.build(request);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error building transaction:', error);

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle API errors with proper status codes
    if (error.status) {
      return NextResponse.json(
        { error: error.message || 'Failed to build transaction' },
        { status: error.status }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error.message || 'Failed to build transaction' },
      { status: 500 }
    );
  }
}
