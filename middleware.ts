import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes are protected (require authentication)
const protectedRoutes = ['/dashboard', '/profile', '/website']
// Define which routes are public (for non-authenticated users)
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes and other non-app routes
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  // Check for authentication token in cookies
  const authToken = request.cookies.get('auth_token')?.value
  const isAuthenticatedCookie = request.cookies.get('isAuthenticated')?.value === 'true'
  const isAuthenticated = Boolean(authToken && isAuthenticatedCookie)

  // If trying to access protected route without authentication, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    
    // Clear any invalid auth cookies
    response.cookies.delete('auth_token')
    response.cookies.delete('isAuthenticated')
    
    return response
  }

  // If trying to access auth routes (login/signup) with valid authentication, redirect to dashboard
  if (authRoutes.includes(pathname) && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // For authenticated routes, pass the token in headers
  if (isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next()
    response.headers.set('Authorization', `Bearer ${authToken}`)
    return response
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 