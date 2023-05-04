import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const secret: string = process.env.NEXT_PUBLIC_JWT_SECRET!;

export async function middleware(request: NextRequest) {

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
