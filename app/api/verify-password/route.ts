import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// GET method to check if the password cookie exists and is valid
export async function GET() {
  try {
    const passwordCookie = cookies().get('site-password');
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    
    // Add console logging to help diagnose issues (will appear in server logs)
    console.log('Checking site password cookie:', {
      hasCookie: !!passwordCookie,
      hasEnvVar: !!correctPassword
    });
    
    if (passwordCookie && passwordCookie.value === correctPassword) {
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Password verification check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST method to verify the submitted password and set cookie
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const password = data.get('password');
    
    console.log('Password verification attempt:', { 
      passwordProvided: !!password,
      correctPasswordExists: !!process.env.NEXT_PUBLIC_SITE_PASSWORD 
    });
    
    // Check if password matches the environment variable
    if (!password || password !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      console.log('Password verification failed');
      return NextResponse.json(
        { error: 'Invalid password' }, 
        { status: 401 }
      );
    }

    console.log('Password verified successfully, setting cookie');
    
    // If password is correct, create response
    const response = NextResponse.json(
      { success: true, message: 'Password verified' }, 
      { status: 200 }
    );
    
    // Set the password cookie with secure options
    // We're using the actual password value, not a hash (ok for dev purposes)
    // In production, consider using a token instead of the actual password
    const cookieStore = cookies();
    cookieStore.set('site-password', process.env.NEXT_PUBLIC_SITE_PASSWORD, {
      httpOnly: true,                         // Makes cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
      sameSite: 'lax',                        // Protects against CSRF
      maxAge: 60 * 60 * 24 * 7,               // 1 week
      path: '/',                              // Available across all pages
    });

    console.log('Cookie set, returning success response');
    return response;
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}
