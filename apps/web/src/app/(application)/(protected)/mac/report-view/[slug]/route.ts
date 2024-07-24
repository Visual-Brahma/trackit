import { dbClient } from "@/lib/db/db_client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/").pop();

  if (!slug) return NextResponse.next();

  const report = await dbClient
    .selectFrom("AttendanceReport")
    .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
    .select(["AttendanceReport.slug", "Meeting.groupId"])
    .where("AttendanceReport.slug", "=", "mac_" + slug)
    .executeTakeFirst();

  if (report) {
    return NextResponse.redirect(
      new URL(`/g/${report.groupId}/r/${report.slug}`, req.url),
    );
  }

  return NextResponse.next();
}
