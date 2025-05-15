import { NextResponse } from 'next/server';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    token: string;
  }
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call FastAPI backend login endpoint
    const response = await fetch('http://0.0.0.0:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username_or_email: username,
        password: password
      })
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Invalid Credentials' },
        { status: response.status }
      );
    }

    // Create response with cookies
    const nextResponse = NextResponse.json({
      message: data.message,
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      },
      token: data.user.token
    });

    // In Next.js, you can directly set whether this is for production
    const isProduction = process.env.NODE_ENV === 'production';

    // Set the JWT token in an HTTP-only cookie
    nextResponse.cookies.set('auth_token', data.user.token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Set non-sensitive user data in a regular cookie
    nextResponse.cookies.set('user', JSON.stringify({
      id: data.user.id,
      username: data.user.username,
      role: data.user.role
    }), {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Set authentication status
    nextResponse.cookies.set('isAuthenticated', 'true', {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return nextResponse;

  } catch (error) {
    //console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid Credentials' },
      { status: 500 }
    );
  }
} 