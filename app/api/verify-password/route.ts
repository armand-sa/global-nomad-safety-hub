import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// GET method to check if the password cookie exists and is valid
export async function GET() {
  try {
    const passwordCookie = cookies().get('site-password');
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    
    // For testing - print debug info to server logs
    console.log('GET /api/verify-password - Checking cookie:', {
      hasCookie: !!passwordCookie,
      hasPassword: !!correctPassword,
      cookieValue: passwordCookie?.value?.substring(0, 3) + '***', // Only log first 3 chars for safety
    });
    
    if (passwordCookie && passwordCookie.value === correctPassword) {
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Password check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST method to verify the submitted password and set cookie
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const password = data.get('password');
    
    // For testing - print debug info to server logs (but not the actual password!)
    console.log('POST /api/verify-password - Password submitted:', { 
      hasPassword: !!password,
      passwordLength: password ? String(password).length : 0,
      hasEnvPassword: !!process.env.NEXT_PUBLIC_SITE_PASSWORD,
    });
    
    // Check if password matches
    if (!password || password !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      console.log('Password verification failed - wrong password');
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    console.log('Password verified successfully, setting cookie');
    
    // Create a basic response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Password accepted' 
    });
    
    // Set password in cookie directly on the response (more reliable)
    response.cookies.set('site-password', String(process.env.NEXT_PUBLIC_SITE_PASSWORD), {
      httpOnly: true,               // Can't be accessed by JavaScript
      secure: true,                 // HTTPS only 
      sameSite: 'strict',           // Extra protection against CSRF
      maxAge: 60 * 60 * 24 * 7,     // 1 week
      path: '/',                    // Available on all pages
    });

    console.log('Cookie set directly on response');
    return response;
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
