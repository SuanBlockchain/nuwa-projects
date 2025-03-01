import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isRootHomePage = nextUrl.pathname === '/';
      const publicRoutes = ['/', '/login']; // Add any other public routes here
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      
      if (!isPublicRoute) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL('/login', nextUrl)); // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isRootHomePage) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;