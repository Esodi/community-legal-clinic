import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ 
        error: 'No active session' 
      }, { status: 401 });
    }

    // Call FastAPI backend logout endpoint
    const response = await fetch('http://0.0.0.0:8000/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Logout failed on server');
    }

    // Create response and clear all auth cookies
    const nextResponse = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });

    // Clear all authentication cookies
    nextResponse.cookies.delete('auth_token');
    nextResponse.cookies.delete('user');
    nextResponse.cookies.delete('isAuthenticated');

    return nextResponse;
  } catch (error) {
    //console.error('Logout error:', error);
    return NextResponse.json({ 
      error: 'Logout failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 