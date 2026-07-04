import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminHomeRoute = pathname === '/admin' || pathname === '/admin/';

  if (pathname.startsWith('/admin') && !isAdminHomeRoute && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('storm_admin_session')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin', request.url));
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth/login')) {
    const token = request.cookies.get('storm_admin_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
