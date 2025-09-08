import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Health check endpoint for Railway
  if (pathname === '/health') {
    return new NextResponse('OK', { status: 200 })
  }

  // Allow access to login and other public routes
  const publicRoutes = ['/login', '/unauthorized']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For all other routes, let the app router handle them
  // This ensures that dynamic routes work properly
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
