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

export const deleteGroup = async ({ groupId }: { groupId: string }) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const groupMembership = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select(["GroupMember.groupId", "GroupMember.role", "User.id as userId"])
      .where((eb) =>
        eb.and([
          eb("User.email", "=", email),
          eb("GroupMember.groupId", "=", groupId),
        ]),
      )
      .executeTakeFirst();

    if (!groupMembership || groupMembership.role !== "OWNER") {
      return {
        success: false,
        message: "Only the owner can delete the group.",
      };
    }

    // Find the default group for the user
    const defaultGroup = await dbClient
      .selectFrom("GroupMember")
      .select("groupId")
      .where("userId", "=", groupMembership.userId)
      .where("isDefault", "=", true)
      .executeTakeFirst();

    if (!defaultGroup) {
      return {
        success: false,
        message: "Default group not found. Cannot delete group.",
      };
    }

    if (defaultGroup.groupId === groupId) {
      return {
        success: false,
        message: "Cannot delete the default group.",
      };
    }

    try {
      await dbClient.transaction().execute(async (trx) => {
        // Move attendance reports to default group
        await trx
          .updateTable("Meeting")
          .set({ groupId: defaultGroup.groupId })
          .where("groupId", "=", groupId)
          .execute();

        // Move InPersonEvents to default group
        await trx
          .updateTable("InPersonEvent")
          .set({ groupId: defaultGroup.groupId })
          .where("groupId", "=", groupId)
          .execute();

        // Delete group members
        await trx
          .deleteFrom("GroupMember")
          .where("groupId", "=", groupId)
          .execute();

        // Delete messages
        await trx.deleteFrom("Message").where("groupId", "=", groupId).execute();

        // Finally delete the group
        await trx.deleteFrom("Group").where("id", "=", groupId).execute();
      });

      return {
        success: true,
        message: "Group deleted successfully.",
      };
    } catch (error) {
      console.error("Error deleting group:", error);
      return {
        success: false,
        message: "Failed to delete the group. Please try again.",
      };
    }
  }
  return {
    success: false,
    message: "You are not authorized to delete the group.",
  };
};
