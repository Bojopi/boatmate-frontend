import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';

const secret: string = process.env.SECRET!;

export async function middleware(request: NextRequest) {
    console.log(request.headers)

    let token = request.cookies.get("tokenUser")?.value;

    if(!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        // console.log(payload)
        return NextResponse.next();
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/welcome',
        '/admin/:path*',
    ]
}
