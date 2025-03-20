// Import necessary functions from Next.js and Supabase
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Handle the authentication callback from Supabase
export async function GET(request: NextRequest) {
  // Get the current URL and extract the code from it
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // If we have an auth code, process it
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // After successful login, send the user to the admin page
  return NextResponse.redirect(new URL('/admin', request.url));
}