import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired - helps with token rotation
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if requesting an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to login if no session exists
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check for admin role in user metadata
    const isAdmin = session.user.app_metadata?.role === 'admin';
    
    if (!isAdmin) {
      // If user is logged in but not an admin, redirect to home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};