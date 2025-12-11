import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const proxy = NextAuth(authConfig).auth;

export const config = {
  // Match all paths except static files and api routes that should be public
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif).*)',
  ],
};
