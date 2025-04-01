import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/signin', '/signup'];
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    pathname === `${path}/` || 
    (path !== '/' && pathname.startsWith(path))
  );
  
  // Static asset paths and API routes - always allow
  const isStaticAsset = /\.(jpg|jpeg|png|gif|svg|css|js|json|ico|png)$/i.test(pathname);
  const isApiPath = pathname.startsWith('/api/');
  const isNextInternalPath = pathname.startsWith('/_next/');
  
  // Allow access to public paths, static assets, API routes without auth check
  if (isPublicPath || isStaticAsset || isApiPath || isNextInternalPath) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  // Since we can't access client-side auth state in middleware,
  // We'll redirect all non-public paths to signin
  // The Auth component will then check if the user is authenticated on the client side
  // and render the page or redirect as needed
  
  // For now, allow access to all routes and let client-side Auth handle the redirects
  return NextResponse.next();
}

// Configure which paths should be checked by this middleware
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};