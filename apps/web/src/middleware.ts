// import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res=NextResponse.next()
    // const session=await getSession(req, res);

    // // if user is not signed in and the current path is not / redirect the user to /
    // if (!session&&req.nextUrl.pathname!=='/') {
    //     return NextResponse.redirect(new URL('/api/auth/login', req.url))
    // }

    // // if user is signed in and the current path is / redirect the user to /account
    // if (session&&req.nextUrl.pathname==='/api/auth/login') {
    //     return NextResponse.redirect(new URL('/app', req.url))
    // }

    return res
}

export const config={
    matcher: ['/', '/app/:path*', '/api/auth/:path*'],
}