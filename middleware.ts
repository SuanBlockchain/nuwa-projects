import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authConfig } from './auth.config';

export default async function middleware(req: NextRequest) {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      console.error("Missing AUTH_SECRET environment variable");
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const token = await getToken({ req, secret });
    const auth = token ? { user: token, expires: token.exp ? new Date(token.exp * 1000).toISOString() : '' } : null;
    const isAuthorized = await authConfig.callbacks.authorized({ auth, request: req });

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL('/login', req.url)); // Graceful fallback
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|seed).*)'],
};