import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge';  // Add this for better performance

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const password = data.get('password');
    const redirectTo = data.get('redirectTo') || '/';  // Add redirect support

    // Check if password matches the environment variable
    if (!password || password !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' }, 
        { status: 401 }
      );
    }

    // If password is correct, set the cookie and redirect
    const response = NextResponse.redirect(new URL(redirectTo.toString(), request.url));

    // Set the password cookie with secure options
    cookies().set('site-password', process.env.NEXT_PUBLIC_SITE_PASSWORD, {
      httpOnly: true,  // Makes cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
      sameSite: 'lax',  // Protects against CSRF
      maxAge: 60 * 60 * 24 * 7,  // 1 week
      path: '/',  // Available across all pages
    });

    return response;
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}
