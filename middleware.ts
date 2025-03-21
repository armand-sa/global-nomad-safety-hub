import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This runs before page loads and checks for password
export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  // Create a default response (will be returned if checks pass)
  const res = NextResponse.next();
  
  // Initialize Supabase client for auth
  const supabase = createMiddlewareClient({ req, res });
  
  // 1. ALLOW THESE PATHS WITHOUT PASSWORD
  // Skip checks for assets, API routes, and the login page itself
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname === '/login' || 
    req.nextUrl.pathname === '/login/' ||
    req.nextUrl.pathname === '/favicon.ico' ||
    req.nextUrl.pathname.includes('.svg') ||
    req.nextUrl.pathname.includes('.png') ||
    req.nextUrl.pathname.includes('.jpg') ||
    req.nextUrl.pathname.includes('.jpeg') ||
    req.nextUrl.pathname.includes('.ico')
  ) {
    // For login paths with trailing slash, redirect to non-trailing version
    if (req.nextUrl.pathname === '/login/') {
      const url = new URL('/login', req.url);
      // Preserve any query params
      req.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      return NextResponse.redirect(url);
    }
    
    // Always bypass password check for login with auth=true param 
    if (req.nextUrl.pathname === '/login' && req.nextUrl.searchParams.get('auth') === 'true') {
      console.log('Auth flow detected, skipping password check');
      return res;
    }
    
    console.log('Skipping password check for:', req.nextUrl.pathname);
    return res;
  }

  // 2. CHECK FOR SITE PASSWORD
  // Get site password from cookies and env var
  const sitePasswordCookie = req.cookies.get('site-password');
  const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
  
  // Log info for debugging (safe info only)
  console.log('Password check:', {
    path: req.nextUrl.pathname,
    hasCookie: !!sitePasswordCookie,
    hasEnvPassword: !!correctPassword,
  });
  
  // If no cookie or wrong password, redirect to login
  if (!sitePasswordCookie || sitePasswordCookie.value !== correctPassword) {
    console.log('No valid password cookie, redirecting to login');
    
    // Create redirect URL to login page (without trailing slash)
    const url = new URL('/login', req.url);
    
    // Remember where user was trying to go
    if (req.nextUrl.pathname !== '/') {
      url.searchParams.set('redirectTo', req.nextUrl.pathname);
    }
    
    return NextResponse.redirect(url);
  }
  
  // 3. SUPABASE SESSION CHECK (only runs if password check passed)
  const { data: { session } } = await supabase.auth.getSession();

  // 4. ADMIN ROUTE PROTECTION
  // Extra security for admin pages
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Send to login if not logged in
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      redirectUrl.searchParams.set('auth', 'true'); // Add auth=true to skip password check
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user has admin rights
    const isAdmin = session?.user?.app_metadata?.role === 'admin';
    
    if (!isAdmin) {
      // Send non-admin users to homepage
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // All checks passed, continue to the requested page
  return res;
}

// Apply middleware to all routes (with better pattern)
export const config = {
  matcher: [
    // Match all paths but exclude static files
    '/((?!_next/static|_next/image).*)',
  ],
};