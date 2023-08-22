import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const secret = process.env.NEXT_PUBLIC_JWT_SECRET ? process.env.NEXT_PUBLIC_JWT_SECRET :'a1b2c3d4e5f6g7@';

export async function middleware(request: NextRequest) {

    let token = request.cookies.get("tokenUser")?.value;

    if(!token) {
        if(request.nextUrl.pathname == '/' ||
            request.nextUrl.pathname.startsWith('/category')
        ) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

        if (request.nextUrl.pathname.startsWith('/welcome')) {
            const allowedRoles = ['ADMIN', 'SUPERADMIN', 'PROVIDER'];
            if (allowedRoles.includes(String(payload.role))) {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(new URL('/category/detailing', request.url));
            }
        }

        if (
            request.nextUrl.pathname === '/' || 
            request.nextUrl.pathname.startsWith('/category') ||
            request.nextUrl.pathname.startsWith('/profile') ||
            request.nextUrl.pathname.startsWith('/inbox') ||
            request.nextUrl.pathname.startsWith('/projects') ||
            request.nextUrl.pathname.startsWith('/providers')
            ) {
            if (payload.role === 'CUSTOMER') {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(new URL('/welcome/profile', request.url));
            }
        }
        // return NextResponse.next();
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/welcome/:path*',
        '/providers/:path*',
        '/profile',
        '/category/:path*',
        '/inbox/:path*',
        '/projects/:path*',
        // '/preferences',
        // '/service-list',
        '/'
    ]
}
