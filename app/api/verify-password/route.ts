import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// DELETE method to clear the site password cookie (needed for logout)
export async function DELETE() {
  try {
    console.log('DELETE /api/verify-password - Clearing password cookie');
    
    // Create a response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Cookie cleared' 
    });
    
    // Clear the password cookie
    response.cookies.set('site-password', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    
    console.log('Cookie cleared successfully');
    return response;
  } catch (error) {
    console.error('Error clearing cookie:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET method to check if the password cookie exists and is valid
export async function GET() {
  try {
    const passwordCookie = cookies().get('site-password');
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    
    // Log detailed info for debugging
    console.log('GET /api/verify-password - Checking cookie:', {
      hasCookie: !!passwordCookie,
      hasPassword: !!correctPassword,
      cookieValue: passwordCookie?.value ? passwordCookie.value.substring(0, 3) + '***' : null, // Only log first 3 chars for safety
    });
    
    // Verify the cookie is valid
    if (passwordCookie && correctPassword && passwordCookie.value === correctPassword) {
      console.log('Password cookie verified');
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      console.log('Password cookie not valid');
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
    
    // Log what we received (but not the actual password)
    console.log('POST /api/verify-password - Password submitted:', { 
      hasPassword: !!password,
      passwordLength: password ? String(password).length : 0,
      hasEnvPassword: !!process.env.NEXT_PUBLIC_SITE_PASSWORD,
      envPasswordLength: process.env.NEXT_PUBLIC_SITE_PASSWORD ? process.env.NEXT_PUBLIC_SITE_PASSWORD.length : 0,
    });
    
    // Check if password matches
    if (!password || !process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      console.log('Password verification failed - missing password or env var');
      return NextResponse.json({ error: 'Missing password', success: false }, { status: 401 });
    }
    
    if (String(password) !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      console.log('Password verification failed - wrong password');
      return NextResponse.json({ error: 'Wrong password', success: false }, { status: 401 });
    }

    console.log('Password verified successfully');
    
    // Create a success response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Password accepted' 
    });
    
    // Set the password cookie
    console.log('Setting password cookie');
    response.cookies.set('site-password', String(process.env.NEXT_PUBLIC_SITE_PASSWORD), {
      httpOnly: true,               // Can't be accessed by JavaScript
      secure: true,                 // HTTPS only 
      sameSite: 'strict',           // Extra protection against CSRF
      maxAge: 60 * 60 * 24 * 7,     // 1 week
      path: '/',                    // Available on all pages
    });

    console.log('Cookie set, returning success response');
    return response;
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'Server error', success: false }, { status: 500 });
  }
}
