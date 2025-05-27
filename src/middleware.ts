import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /admin (but is not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({ req: request });

    // If not logged in, redirect to login
    if (!token) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};