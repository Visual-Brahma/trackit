"use server";

import { dbClient } from "@/lib/db/db_client";
import { MeetingPlatform } from "@/types/database.types";
import { getServerSession } from "next-auth";

interface MemberPresence {
  name: string;
  joinTime: string;
  leaveTime: string;
  avatarUrl: string;
  attendedDuration: number;
}

interface MeetAttendanceReportData {
  groupId?: string;
  meetCode: string;
  date: string;
  startTime: string;
  stopTime: string;
  participants: MemberPresence[];
}

export const saveAttendanceReport = async ({
  meetCode,
  date,
  ...data
}: MeetAttendanceReportData) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;
    const [day, month, year] = date.split("/") as [string, string, string];
    const meetDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const startTime = new Date(
      meetDate.getFullYear(),
      meetDate.getMonth(),
      meetDate.getDate(),
      parseInt(data.startTime.split(":")[0]!),
      parseInt(data.startTime.split(":")[1]!),
      parseInt(data.startTime.split(":")[2]!),
    );
    const endTime = new Date(
      meetDate.getFullYear(),
      meetDate.getMonth(),
      meetDate.getDate(),
      parseInt(data.stopTime.split(":")[0]!),
      parseInt(data.stopTime.split(":")[1]!),
      parseInt(data.stopTime.split(":")[2]!),
    );

    if (endTime < startTime) {
      endTime.setDate(meetDate.getDate() + 1);
    }

    try {
      let groupId = data.groupId;

      if (groupId) {
        const group = await dbClient
          .selectFrom("GroupMember")
          .innerJoin("Group", (join) =>
            join.onRef("Group.id", "=", "GroupMember.groupId"),
          )
          .select("Group.id")
          .where((eb) =>
            eb.and([
              eb("GroupMember.userId", "=", (eb) =>
                eb
                  .selectFrom("User")
                  .select("User.id")
                  .where("email", "=", email),
              ),
              eb("Group.id", "=", groupId!),
            ]),
          )
          .executeTakeFirst();

        if (!group) {
          return;
        }
      } else {
        const group = await dbClient
          .selectFrom("GroupMember")
          .innerJoin("Group", (join) =>
            join
              .onRef("Group.id", "=", "GroupMember.groupId")
              .on("Group.isDefault", "=", true),
          )
          .select("Group.id")
          .where((eb) =>
            eb.and([
              eb("GroupMember.userId", "=", (eb) =>
                eb
                  .selectFrom("User")
                  .select("User.id")
                  .where("email", "=", email),
              ),
              eb("GroupMember.role", "=", "OWNER"),
            ]),
          )
          .executeTakeFirst();

        if (!group) {
          return;
        }

        groupId = group.id;
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
            startTime: startTime,
            endTime: endTime,
          })
          .returning(["id"])
          .executeTakeFirstOrThrow();

        return await trx
          .insertInto("AttendanceReport")
          .values({
            meetingId: meeting.id,
            membersPresence: JSON.stringify(data.participants),
          })
          .returning(["slug"])
          .executeTakeFirst();
      });

      if (report) {
        return {
          groupId: groupId,
          slug: report.slug,
        };
      }
    } catch (error) {
      console.log("Error saving attendance report.", error);
    }
  }
};
