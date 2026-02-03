"use server";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";

export const toggleReportPublicStatus = async (
  slug: string,
  groupId: string,
  status: boolean,
) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;
    try {
      const report = await dbClient
        .selectFrom("AttendanceReport")
        .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
        .innerJoin("GroupMember", "GroupMember.groupId", "Meeting.groupId")
        .innerJoin("User", "User.id", "GroupMember.userId")
        .select("AttendanceReport.id")
        .where((eb) =>
          eb.and([
            eb("AttendanceReport.slug", "=", slug),
            eb("User.email", "=", email),
            eb("Meeting.groupId", "=", groupId),
            eb.or([
              eb("GroupMember.role", "=", "ADMIN"),
              eb("GroupMember.role", "=", "OWNER"),
            ]),
          ]),
        )
        .executeTakeFirst();

      if (report) {
        const reportStatus = await dbClient
          .updateTable("AttendanceReport")
          .set({
            isPublic: status,
          })
          .where("AttendanceReport.slug", "=", slug)
          .executeTakeFirst();

        if (reportStatus.numUpdatedRows) {
          return true;
        }
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      return false;
    }
  }

  return false;
};

export const moveAttendanceReport = async ({
  slug,
  currentGroupId,
  newGroupId,
}: {
  slug: string;
  currentGroupId: string;
  newGroupId: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;
    try {
      // Verify user has permission in both groups
      const currentGroupPermission = await dbClient
        .selectFrom("GroupMember")
        .innerJoin("User", "GroupMember.userId", "User.id")
        .select("GroupMember.id")
        .where("User.email", "=", email)
        .where("GroupMember.groupId", "=", currentGroupId)
        .where("GroupMember.role", "in", ["OWNER", "ADMIN"])
        .executeTakeFirst();

      const newGroupPermission = await dbClient
        .selectFrom("GroupMember")
        .innerJoin("User", "GroupMember.userId", "User.id")
        .select("GroupMember.id")
        .where("User.email", "=", email)
        .where("GroupMember.groupId", "=", newGroupId)
        .where("GroupMember.role", "in", ["OWNER", "ADMIN"])
        .executeTakeFirst();

      if (!currentGroupPermission || !newGroupPermission) {
        return {
          success: false,
          message: "You don't have permission to move reports between these groups.",
        };
      }

      const report = await dbClient
        .selectFrom("AttendanceReport")
        .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
        .select("Meeting.id as meetingId")
        .where("AttendanceReport.slug", "=", slug)
        .where("Meeting.groupId", "=", currentGroupId)
        .executeTakeFirst();

      if (!report) {
        return {
          success: false,
          message: "Report not found.",
        };
      }

      await dbClient
        .updateTable("Meeting")
        .set({ groupId: newGroupId })
        .where("id", "=", report.meetingId)
        .executeTakeFirstOrThrow();

      return {
        success: true,
        message: "Report moved successfully.",
      };
    } catch (error) {
      console.error("Error moving report:", error);
      return {
        success: false,
        message: "Failed to move report. Please try again.",
      };
    }
  }

  return {
    success: false,
    message: "You must be signed in to move reports.",
  };
};

export const shareAttendanceReport = async (
  slug: string,
  groupId: string,
  newEmails: string[],
  oldEmails: string[],
) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;
    try {
      const report = await dbClient
        .selectFrom("AttendanceReport")
        .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
        .innerJoin("GroupMember", "GroupMember.groupId", "Meeting.groupId")
        .innerJoin("User", "User.id", "GroupMember.userId")
        .select("AttendanceReport.id")
        .where((eb) =>
          eb.and([
            eb("AttendanceReport.slug", "=", slug),
            eb("User.email", "=", email),
            eb("Meeting.groupId", "=", groupId),
            eb.or([
              eb("GroupMember.role", "=", "ADMIN"),
              eb("GroupMember.role", "=", "OWNER"),
            ]),
          ]),
        )
        .executeTakeFirst();

      if (report) {
        const shareStatus = await dbClient
          .updateTable("AttendanceReport")
          .set({
            sharedWith: [...newEmails, ...oldEmails],
          })
          .returning("sharedWith")
          .where("AttendanceReport.slug", "=", slug)
          .executeTakeFirst();

        if (shareStatus) {
          // TODO: send email to those who have been shared with
          return shareStatus.sharedWith;
        }
      }
    } catch (error) {
      console.error("Error sharing report:", error);
    }
  }
};

export const deleteAttendanceReport = async (slug: string, groupId: string) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;
    try {
      const report = await dbClient
        .selectFrom("AttendanceReport")
        .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
        .innerJoin("GroupMember", "GroupMember.groupId", "Meeting.groupId")
        .innerJoin("User", "User.id", "GroupMember.userId")
        .select("AttendanceReport.id")
        .where((eb) =>
          eb.and([
            eb("AttendanceReport.slug", "=", slug),
            eb("User.email", "=", email),
            eb("Meeting.groupId", "=", groupId),
            eb.or([
              eb("GroupMember.role", "=", "ADMIN"),
              eb("GroupMember.role", "=", "OWNER"),
            ]),
          ]),
        )
        .executeTakeFirst();

      if (report) {
        const deleteStatus = await dbClient
          .deleteFrom("AttendanceReport")
          .where("AttendanceReport.id", "=", report.id)
          .executeTakeFirst();

        if (deleteStatus.numDeletedRows) {
          return true;
        }
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      return false;
    }
  }

  return false;
};
