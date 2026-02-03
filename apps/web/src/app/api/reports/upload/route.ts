import { dbClient } from "@/lib/db/db_client";
import { MeetingPlatform } from "@/types/database.types";
import { decode, getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Try to get token from session/cookie first
  let token = await getToken({ req });

  // If no token from cookie, check Authorization header (for extension)
  if (!token) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const rawToken = authHeader.substring(7);
      try {
        token = await decode({
          token: rawToken,
          secret: process.env.NEXTAUTH_SECRET!,
        });
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }

  if (!token || !token.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = token.email;
  const body = await req.json();
  const { meetCode, date, startTime, stopTime, participants, groupId: providedGroupId } = body;

  if (!meetCode || !date || !startTime || !stopTime || !participants) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [day, month, year] = date.split("/") as [string, string, string];
    const meetDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const start = new Date(
      meetDate.getFullYear(),
      meetDate.getMonth(),
      meetDate.getDate(),
      parseInt(startTime.split(":")[0]!),
      parseInt(startTime.split(":")[1]!),
      parseInt(startTime.split(":")[2]!),
    );
    const end = new Date(
      meetDate.getFullYear(),
      meetDate.getMonth(),
      meetDate.getDate(),
      parseInt(stopTime.split(":")[0]!),
      parseInt(stopTime.split(":")[1]!),
      parseInt(stopTime.split(":")[2]!),
    );

    if (end < start) {
      end.setDate(meetDate.getDate() + 1);
    }

    let groupId = providedGroupId;

    if (groupId) {
      const group = await dbClient
        .selectFrom("GroupMember")
        .innerJoin("User", "GroupMember.userId", "User.id")
        .select("GroupMember.groupId")
        .where((eb) =>
          eb.and([
            eb("User.email", "=", email),
            eb("GroupMember.groupId", "=", groupId!),
          ]),
        )
        .executeTakeFirst();

      if (!group) {
        return NextResponse.json({ error: "Group not found or no permission" }, { status: 403 });
      }
    } else {
      // fetch the default group
      const group = await dbClient
        .selectFrom("GroupMember")
        .innerJoin("User", "GroupMember.userId", "User.id")
        .select("GroupMember.groupId")
        .where((eb) =>
          eb.and([
            eb("User.email", "=", email),
            eb("GroupMember.isDefault", "=", true),
          ]),
        )
        .executeTakeFirst();

      if (!group) {
        return NextResponse.json({ error: "Default group not found" }, { status: 404 });
      }

      groupId = group.groupId;
    }

    const report = await dbClient.transaction().execute(async (trx) => {
      const meeting = await trx
        .insertInto("Meeting")
        .values({
          name: meetCode,
          date: meetDate,
          groupId: groupId,
          meetLink: `https://meet.google.com/${meetCode}`,
          meetPlatform: MeetingPlatform.GOOGLE_MEET,
          startTime: start,
          endTime: end,
        })
        .returning(["id"])
        .executeTakeFirstOrThrow();

      return await trx
        .insertInto("AttendanceReport")
        .values({
          meetingId: meeting.id,
          membersPresence: JSON.stringify(participants),
        })
        .returning(["slug"])
        .executeTakeFirst();
    });

    if (report) {
      return NextResponse.json({
        success: true,
        groupId: groupId,
        slug: report.slug,
      });
    }

    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  } catch (error) {
    console.error("Error saving attendance report via API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
