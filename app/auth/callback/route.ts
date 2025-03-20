// Import necessary functions from Next.js and Supabase
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Handle the authentication callback from Supabase
export const runtime = 'edge';  // Add this line for better performance

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the auth code from the URL
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
    }
    
    // After auth, redirect to homepage
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (error) {
    // If anything goes wrong, redirect to homepage
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }
}