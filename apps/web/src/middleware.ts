import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';
import environmentVariables from './config/environment';
import { dbClient } from './lib/db/db_client';

export async function middleware(req: NextRequest) {
    const res=NextResponse.next()

    const session=await getToken({ req, secret: environmentVariables.auth.nextAuthSecret });

    if (process.env.NODE_ENV==='development') {
        // console.log('session', session);
    }
    // if user is not signed in and the current path is not / redirect the user to /
    if (!session?.email&&(req.nextUrl.pathname.startsWith('/dashboard')||req.nextUrl.pathname.startsWith('/g'))) {
        return NextResponse.redirect(new URL('/api/auth/signin?callback='+encodeURIComponent(req.nextUrl.pathname), req.url))
    }

    // if user is signed in and the current path is / redirect the user to /dashboard
    if (session?.email&&req.nextUrl.pathname==='/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/mac/report-view/')||req.nextUrl.pathname.startsWith("/view-attendance-report/")) {
        let slug=req.nextUrl.pathname.split('/').pop();

        if (!slug) return res;

        if (req.nextUrl.pathname.startsWith('/mac/report-view/')) {
            slug="mac_"+slug;
        }

        const report=await dbClient.selectFrom("AttendanceReport")
            .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
            .select(["AttendanceReport.slug", "Meeting.groupId"])
            .where("AttendanceReport.slug", "=", slug)
            .executeTakeFirst();

        if (report) {
            return NextResponse.redirect(new URL(`/g/${report.groupId}/r/${report.slug}`, req.url))
        }
    }

    return res
}

export const config={
    matcher: ['/', '/dashboard/:path*', '/g/:path*', '/mac/report-view/:path*', '/view-attendance-report/:path*'],
}