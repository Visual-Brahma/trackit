import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import environmentVariables from "./config/environment";
// import { dbClient } from './lib/db/db_client';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = await getToken({
    req,
    secret: environmentVariables.auth.nextAuthSecret,
  });

  // if (process.env.NODE_ENV==='development') {
  //     console.log('session', session);
  // }
  // if user is not signed in and the current path is not / redirect the user to /
  if (
    !session?.email &&
    (req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/g") ||
      req.nextUrl.pathname === "/save-report")
  ) {
    return NextResponse.redirect(
      new URL(
        "/api/auth/signin?callback=" + encodeURIComponent(req.nextUrl.pathname),
        req.url,
      ),
    );
  }

  // if user is signed in and the current path is / redirect the user to /dashboard
  if (session?.email && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/g/:path*", "/save-report"],
};
