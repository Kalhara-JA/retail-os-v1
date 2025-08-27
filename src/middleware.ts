import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle large file uploads for Payload API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For file uploads, we need to handle this differently
    // The body size limit is handled by Vercel configuration and Payload
    const response = NextResponse.next()
    
    // Set CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
