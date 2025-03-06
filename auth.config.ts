import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isRootHomePage = nextUrl.pathname === '/';
      const publicRoutes = ['/', '/login', '/seed'];
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

      if (isLoggedIn && isRootHomePage) {
        // Let middleware handle the redirect to /dashboard
        return false; // Deny access to root, middleware will redirect
      }
      if (!isPublicRoute && !isLoggedIn) {
        return false; // Deny access to protected routes if not logged in
      }
      return true; // Allow access to public routes or authenticated users
    },
  },
  providers: [],
} satisfies NextAuthConfig;