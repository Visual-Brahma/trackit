import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { getUser } from './app/api/logto/user/get-user';

export async function middleware(req: NextRequest) {
    const res=NextResponse.next()
    const user=await getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // if user is not signed in and the current path is not / redirect the user to /
    if (!user.isAuthenticated&&req.nextUrl.pathname.startsWith('/app')) {
        return NextResponse.redirect(new URL('/api/logto/sign-in', req.url))
    }

    // if user is signed in and the current path is / redirect the user to /account
    console.log(user);
    if (user.isAuthenticated&&req.nextUrl.pathname==='/') {
        return NextResponse.redirect(new URL('/app', req.url))
    }

    return res
}

export const config={
    matcher: ['/', '/app/:path*'],
}