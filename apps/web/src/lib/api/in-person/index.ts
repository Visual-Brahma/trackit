"use server";

import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";

export const createInPersonAttendanceLink = async (data: {
  name: string;
  venue?: string;
  allowedEmailDomains: string[];
  allowedEmails: string[];
  date: string;
  startTime: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const group = await dbClient
      .selectFrom("GroupMember")
      .innerJoin("Group", (join) =>
        join
          .onRef("Group.id", "=", "GroupMember.groupId")
          .on("Group.isDefault", "=", true)
      )
      .select("Group.id")
      .where((eb) =>
        eb.and([
          eb("GroupMember.userId", "=", (eb) =>
            eb.selectFrom("User").select("User.id").where("email", "=", email)
          ),
          eb("GroupMember.role", "=", "OWNER"),
        ])
      )
      .executeTakeFirst();

    if (!group) {
      return false;
    }

    const event = await dbClient
      .insertInto("InPersonEvent")
      .values({
        name: data.name,
        slug: "",
        venue: data.venue,
        allowedEmailDomains: data.allowedEmailDomains,
        allowedEmails: data.allowedEmails,
        date: data.date,
        startTime: data.startTime,
        groupId: group.id,
      })
      .returning("slug")
      .executeTakeFirst();

    return event?.slug || false;
  }
  return false;
};

export const endInPersonEvent = async ({
  id,
  endTime,
}: {
  id: number;
  endTime: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const result = await dbClient
      .updateTable("InPersonEvent")
      .set({
        endTime: endTime,
      })
      .where((eb) =>
        eb.and([
          eb("id", "=", id),
          eb("groupId", "in", (eb) =>
            eb
              .selectFrom("GroupMember")
              .select("GroupMember.groupId")
              .where((eb) =>
                eb.and([
                  eb("role", "in", ["ADMIN", "OWNER"]),
                  eb("GroupMember.userId", "=", (eb) =>
                    eb
                      .selectFrom("User")
                      .select("User.id")
                      .where("User.email", "=", email)
                  ),
                ])
              )
          ),
        ])
      )
      .executeTakeFirst();

    if (result.numUpdatedRows > 0) {
      return true;
    }
  }

  return false;
};

export const registerToInPersonEvent = async ({
  eventId,
  registrationTime,
}: {
  eventId: number;
  registrationTime: string;
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
    const eventCheckIn = await dbClient
      .insertInto("InPersonEventAttendee")
      .values({
        userId: user.id,
        eventId: eventId,
        registrationTime: registrationTime,
      })
      .returning("id")
      .executeTakeFirst();
    if (eventCheckIn && eventCheckIn.id) {
      return true;
    }
  }
  return false;
};

export const checkInToInPersonEvent = async ({
  eventId,
  userId,
  checkInTime,
}: {
  checkInTime: string;
  eventId: number;
  userId: string;
}) => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const userPerm = await dbClient
      .selectFrom("InPersonEvent")
      .select("id")
      .where((eb) =>
        eb.and([
          eb("id", "=", eventId),
          eb("groupId", "in", (eb) =>
            eb
              .selectFrom("GroupMember")
              .select("GroupMember.groupId")
              .where((eb) =>
                eb.and([
                  eb("role", "in", ["ADMIN", "OWNER"]),
                  eb("GroupMember.userId", "=", (eb) =>
                    eb
                      .selectFrom("User")
                      .select("User.id")
                      .where("User.email", "=", email)
                  ),
                ])
              )
          ),
        ])
      )
      .executeTakeFirst();

    if (!userPerm) {
      return false;
    }

    const eventCheckIn = await dbClient
      .updateTable("InPersonEventAttendee")
      .set({
        checkInTime: checkInTime,
      })
      .where("userId", "=", userId)
      .returning("id")
      .executeTakeFirst();

    if (eventCheckIn && eventCheckIn.id) {
      return true;
    }
  }
  return false;
};

export const editInPersonEvent = async ({
  id,
  ...data
}: {
  name?: string;
  venue?: string;
  id: number;
}) => {
  // check if all of the fields are empty or not
  if (Object.values(data).every((val) => !val)) {
    return true;
  }

  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const email = session.user.email;

    const result = await dbClient
      .updateTable("InPersonEvent")
      .set(data)
      .where((eb) =>
        eb.and([
          eb("id", "=", id),
          eb("groupId", "in", (eb) =>
            eb
              .selectFrom("GroupMember")
              .select("GroupMember.groupId")
              .where((eb) =>
                eb.and([
                  eb("role", "in", ["ADMIN", "OWNER"]),
                  eb("GroupMember.userId", "=", (eb) =>
                    eb
                      .selectFrom("User")
                      .select("User.id")
                      .where("User.email", "=", email)
                  ),
                ])
              )
          ),
        ])
      )
      .executeTakeFirst();

    if (result.numUpdatedRows > 0) {
      return true;
    }
  }

  return false;
};
