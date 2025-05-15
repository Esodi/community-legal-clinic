import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'


async function readAuthData() {
  try {
    const filePath = path.join(process.cwd(), 'app/api', 'auth.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    //console.error('Error reading auth data:', error)
    return null
  }
}

async function readUsersData() {
  try {
    const filePath = path.join(process.cwd(), 'app/api', 'users.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    //console.error('Error reading users data:', error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization')
    const cookieStore = cookies()
    
    let token = authHeader?.replace('Bearer ', '')
    
    // If no token in Authorization header, check cookies
    if (!token || token === 'undefined') {
      token = cookieStore.get('auth_token')?.value
    }

    if (!token || token === 'undefined') {
      return NextResponse.json({ 
        error: 'Not authenticated',
        message: 'No valid token found'
      }, { status: 401 })
    }

    // Verify token with FastAPI backend
    const response = await fetch('http://0.0.0.0:8000/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // Clear invalid cookies
      const nextResponse = NextResponse.json({ 
        error: 'Invalid or expired token',
        message: 'Please login again'
      }, { status: 401 })

      nextResponse.cookies.delete('auth_token')
      nextResponse.cookies.delete('user')
      nextResponse.cookies.delete('isAuthenticated')

      return nextResponse
    }

    const userData = await response.json()

    // Create successful response
    const nextResponse = NextResponse.json({
      isAuthenticated: true,
      user: {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        email: userData.email
      },
      token: token
    })

    // Refresh cookies
    nextResponse.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    nextResponse.cookies.set('user', JSON.stringify({
      username: userData.username,
      role: userData.role
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    nextResponse.cookies.set('isAuthenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    return nextResponse

  } catch (error) {
    //console.error('Auth check error:', error)
    return NextResponse.json({ 
      error: 'Invalid Credentials',
      message: 'An error occurred while checking authentication'
    }, { status: 500 })
  }
} 