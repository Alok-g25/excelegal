import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // If the base URL is accessed, redirect to the /admin/login page
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If the token exists and the user is trying to access the login page, redirect to the dashboard
    if (token && pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If the token does not exist and the user is trying to access any /admin route except login, redirect to login page
    if (!token && pathname.startsWith('/admin') && pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If the request passes the checks, proceed to the next middleware or request handler
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*'], // Match the base URL and all paths under /admin
};
