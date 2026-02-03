"use server";
import { dbClient } from "@/lib/db/db_client";
import { MeetingPlatform } from "@/types/database.types";
import { getServerSession } from "next-auth";

export const createMeeting = async ({
  groupId,
  name,
  date,
  startTime,
  endTime,
  agenda,
  meetLink,
  isOnline = true,
}: {
  groupId: string;
  name: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  agenda?: string;
  meetLink?: string;
  isOnline?: boolean;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const userPermission = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select("GroupMember.id")
      .where("User.email", "=", email)
      .where("GroupMember.groupId", "=", groupId)
      .where("GroupMember.role", "in", ["OWNER", "ADMIN"])
      .executeTakeFirst();

    if (!userPermission) {
      return {
        success: false,
        message: "You are not authorized to create meetings in this group.",
      };
    }

    try {
      const start = new Date(date);
      const [startH, startM] = startTime.split(":").map(Number);
      start.setHours(startH!, startM!, 0, 0);

      const end = new Date(date);
      const [endH, endM] = endTime.split(":").map(Number);
      end.setHours(endH!, endM!, 0, 0);

      await dbClient
        .insertInto("Meeting")
        .values({
          groupId,
          name,
          date,
          startTime: start,
          endTime: end,
          agenda: agenda ? JSON.stringify(agenda) : null,
          meetLink,
          isOnline,
          meetPlatform: isOnline ? MeetingPlatform.GOOGLE_MEET : null,
        })
        .executeTakeFirstOrThrow();

      return {
        success: true,
        message: "Meeting scheduled successfully.",
      };
    } catch (error) {
      console.error("Error creating meeting:", error);
      return {
        success: false,
        message: "Failed to schedule meeting. Please try again.",
      };
    }
  }
  return {
    success: false,
    message: "You must be signed in to schedule meetings.",
  };
};

export const deleteMeeting = async (meetingId: number, groupId: string) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const userPermission = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select("GroupMember.id")
      .where("User.email", "=", email)
      .where("GroupMember.groupId", "=", groupId)
      .where("GroupMember.role", "in", ["OWNER", "ADMIN"])
      .executeTakeFirst();

    if (!userPermission) {
      return false;
    }

    await dbClient
      .deleteFrom("Meeting")
      .where("id", "=", meetingId)
      .where("groupId", "=", groupId)
      .execute();

    return true;
  }
  return false;
};
