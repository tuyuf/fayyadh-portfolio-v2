import { NextResponse } from 'next/server';

export function middleware(request) {
    // Only protect /admin routes, but allow access to /admin/login
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
        const adminToken = request.cookies.get('admin_token');

        if (!adminToken || adminToken.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
