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
    req.nextUrl.pathname.includes('favicon.ico') ||
    req.nextUrl.pathname.includes('.svg') ||
    req.nextUrl.pathname.includes('.png') ||
    req.nextUrl.pathname.includes('.jpg') ||
    req.nextUrl.pathname.includes('.jpeg') ||
    req.nextUrl.pathname.includes('.ico')
  ) {
    return res;
  }

  // 2. SUPABASE SESSION CHECK
  // Keep the user's login session active
  const { data: { session } } = await supabase.auth.getSession();
  
  // 3. SITE PASSWORD PROTECTION
  // Check the site password (except for login page)
  if (!req.nextUrl.pathname.startsWith('/login')) {
    // Get the site password from the cookie
    const sitePasswordCookie = req.cookies.get('site-password');
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    
    // Add debugging data to response headers (only in development)
    const debugHeaders = new Headers(res.headers);
    debugHeaders.set('x-debug-has-cookie', sitePasswordCookie ? 'yes' : 'no');
    debugHeaders.set('x-debug-has-password-env', correctPassword ? 'yes' : 'no');

    // Check if the password cookie exists and matches the correct password
    if (!sitePasswordCookie || sitePasswordCookie.value !== correctPassword) {
      console.log('Password protection: redirecting to login page');
      // Password is missing or incorrect, redirect to login page
      const url = new URL('/login', req.url);
      
      // Add the current URL as a redirect destination
      if (req.nextUrl.pathname !== '/') {
        url.searchParams.set('redirectTo', req.nextUrl.pathname);
      }
      
      // Create a new response with the modified headers
      const redirectRes = NextResponse.redirect(url);
      
      // Copy debug headers to the redirect response
      for (const [key, value] of debugHeaders.entries()) {
        redirectRes.headers.set(key, value);
      }
      
      return redirectRes;
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (files in the public/images directory)
     * - api/verify-password (password verification API)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};