"use server";

import { dbClient } from "@/lib/db/db_client";
import { Role } from "@/types/database.types";
import { getServerSession } from "next-auth";

export const createGroup = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const user = await dbClient
      .selectFrom("User")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return false;
    }

    const group = await dbClient.transaction().execute(async (trx) => {
      const group = await trx
        .insertInto("Group")
        .values({
          name,
          description,
        })
        .returning(["id", "joinCode"])
        .executeTakeFirstOrThrow();

      const membershipId = await trx
        .insertInto("GroupMember")
        .values({
          userId: user.id,
          groupId: group!.id,
          role: "OWNER",
        })
        .returning(["id"])
        .executeTakeFirst();

      if (!membershipId) {
        return null;
      }

      return group;
    });

    if (group) {
      return group;
    }
  }
  return false;
};

export const joinGroup = async (joinCode: string) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const user = await dbClient
      .selectFrom("User")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const group = await dbClient
      .selectFrom("Group")
      .select("id")
      .where("Group.joinCode", "=", joinCode)
      .executeTakeFirst();

    if (!group) {
      return {
        success: false,
        message: "Invalid join code.",
      };
    }

    try {
      await dbClient
        .insertInto("GroupMember")
        .values({
          userId: user.id,
          groupId: group.id,
          role: "MEMBER",
        })
        .executeTakeFirstOrThrow();

      return {
        success: true,
        message: "Group joined successfully.",
      };
    } catch (e) {
      return {
        success: true,
        message: "You are already a member of this group.",
      };
    }
  }
  return {
    success: false,
    message: "Failed to join group. Please try again.",
  };
};

export const removeUserFromGroup = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const user = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select("GroupMember.id")
      .where("User.email", "=", email)
      .where("GroupMember.groupId", "=", groupId)
      .where((eb) =>
        eb.or([
          eb("GroupMember.role", "in", ["OWNER", "ADMIN"]),
          eb("User.id", "=", userId),
        ])
      )
      .executeTakeFirst();

    if (!user) {
      return false;
    }

    const membership = await dbClient
      .selectFrom("GroupMember")
      .select("id")
      .where("groupId", "=", groupId)
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (!membership) {
      return false;
    }

    await dbClient
      .deleteFrom("GroupMember")
      .where("id", "=", membership.id)
      .execute();

    return true;
  }
  return false;
};

export const changeUserRoleInGroup = async ({
  groupId,
  userId,
  role,
}: {
  groupId: string;
  userId: string;
  role: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const user = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("User", "GroupMember.userId", "User.id")
      .select("GroupMember.id")
      .where("User.email", "=", email)
      .where("GroupMember.groupId", "=", groupId)
      .where("GroupMember.role", "in", ["OWNER", "ADMIN"])
      .executeTakeFirst();

    if (!user) {
      return false;
    }

    const membership = await dbClient
      .selectFrom("GroupMember")
      .select("id")
      .where("groupId", "=", groupId)
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (!membership) {
      return false;
    }

    await dbClient
      .updateTable("GroupMember")
      .set({
        role: Role[role as keyof typeof Role],
      })
      .where("id", "=", membership.id)
      .execute();

    return true;
  }
  return false;
};
