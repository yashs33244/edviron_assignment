import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/payment-callback', // Allow callback URL for payment processing
  '/transaction-status',
];

// Middleware to handle authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for token in cookies (middleware) first, then fallback to localStorage check in components
  const token = request.cookies.get('token')?.value;
  
  // Check if the user is authenticated
  const isAuthenticated = !!token;
  
  // Dynamic route matcher for API routes, public files, etc.
  const isPublicRoute = 
    publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') || // For public assets like images, js, css
    pathname.startsWith('/fonts');

  // Dashboard routes and other protected routes
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.includes('/user-transactions') ||
    pathname.includes('/transactions');

  // If user is trying to access a protected route without being authenticated
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
``
// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. All files in the public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 