import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // 1. SKIP CHECKS FOR PUBLIC RESOURCES AND API ROUTES
  // Don't check passwords or auth for static files, images, and API routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('favicon.ico')
  ) {
    return res;
  }

  // 2. SUPABASE SESSION CHECK
  // Keep the user's login session active
  const { data: { session } } = await supabase.auth.getSession();
  
  // 3. SITE PASSWORD PROTECTION
  // Check the site password (except for login page)
  if (!req.nextUrl.pathname.startsWith('/login')) {
    const hasPassword = req.cookies.get('site-password');
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    // Add debugging headers (these are safe to expose in dev)
    if (process.env.NODE_ENV !== 'production') {
      res.headers.set('X-Debug-Has-Password', hasPassword ? 'true' : 'false');
      res.headers.set('X-Debug-Has-Correct-Env', correctPassword ? 'true' : 'false');
    }

    if (!hasPassword || hasPassword.value !== correctPassword) {
      // Redirect to login page with intended destination
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. ADMIN ROUTE PROTECTION
  // Extra security for admin pages
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Send to login if not logged in
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user has admin rights
    const isAdmin = session.user.app_metadata?.role === 'admin';
    
    if (!isAdmin) {
      // Send non-admin users to homepage
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return res;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    '/(.*)',  // Match all routes
  ],
};