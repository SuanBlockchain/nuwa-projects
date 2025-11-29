import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/signup'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnUpload = nextUrl.pathname.startsWith('/upload');
      const isOnApiSeed = nextUrl.pathname.startsWith('/api/seed');

      // Protect upload route (creating projects requires auth)
      if (isOnUpload) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      }

      // Admin-only route protection
      if (isOnApiSeed) {
        if (isLoggedIn && auth.user.role === 'ADMIN') return true;
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      // Handle session updates (e.g., profile changes)
      if (trigger === 'update' && session) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'GESTOR' | 'ADMIN';
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [], // Providers will be added in auth.ts
  session: {
    strategy: 'jwt', // JWT strategy for Vercel deployment
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true, // Required for Vercel
} satisfies NextAuthConfig;
