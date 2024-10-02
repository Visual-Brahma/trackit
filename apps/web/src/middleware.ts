import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { serverEnv } from "./config/env/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = await getToken({
    req,
    secret: serverEnv.NEXTAUTH_SECRET,
  });

  // if user is not signed in and the current path is not / redirect the user to /
  if (!session?.email && req.nextUrl.pathname !== "/") {
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
