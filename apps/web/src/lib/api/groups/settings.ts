"use server";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";

export const updateGroupGeneralSettings = async ({
  name,
  description,
  groupId,
  allowNewMembers,
}: {
  groupId: string;
  name: string;
  description: string;
  allowNewMembers: boolean;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const group = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select("GroupMember.groupId")
      .where((eb) =>
        eb.and([
          eb("User.email", "=", email),
          eb("GroupMember.role", "in", ["OWNER", "ADMIN"]),
          eb("GroupMember.groupId", "=", groupId),
        ]),
      )
      .executeTakeFirst();

    if (!group) {
      return false;
    }

    try {
      await dbClient
        .updateTable("Group")
        .set({
          name,
          description,
          isAcceptingMembers: allowNewMembers,
        })
        .where((eb) => eb("id", "=", groupId))
        .executeTakeFirstOrThrow();
    } catch (error) {
      return false;
    }
  }
  return false;
};

export const updateGroupJoinCode = async ({ groupId }: { groupId: string }) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const group = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select("GroupMember.groupId")
      .where((eb) =>
        eb.and([
          eb("User.email", "=", email),
          eb("GroupMember.role", "in", ["OWNER", "ADMIN"]),
          eb("GroupMember.groupId", "=", groupId),
        ]),
      )
      .executeTakeFirst();

    if (!group) {
      return {
        success: false,
        message: "You are not authorized to update the group join code.",
      };
    }

    try {
      const { joinCode } = await dbClient
        .updateTable("Group")
        .set(({ fn, val }) => ({
          joinCode: fn<string>("generate_unique_slug", [
            val("Group"),
            val("joinCode"),
          ]),
        }))
        .where("id", "=", groupId)
        .returning("Group.joinCode")
        .executeTakeFirstOrThrow();

      return {
        success: true,
        message: joinCode,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update the join code. Please try again.",
      };
    }
  }
  return {
    success: false,
    message: "You are not authorized to update the group join code.",
  };
};
