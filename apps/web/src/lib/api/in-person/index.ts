"use server";

import { dbClient } from "@/lib/db/db_client";
import { point } from "@/lib/utils/format";
import { getServerSession } from "next-auth";
import { checkIfWithinRange } from "./location";

export const createInPersonAttendanceLink = async (data: {
  name: string;
  venue?: string;
  location: { lat: number; lng: number };
  allowedRange: number;
  allowedEmailDomains: string[];
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
          eb("GroupMember.role", "=", "OWNER")
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
        location: point({ x: data.location.lat, y: data.location.lng }),
        allowedRange: data.allowedRange,
        allowedEmailDomains: data.allowedEmailDomains,
        date: data.date,
        startTime: data.startTime,
        groupId: group.id
      })
      .returning("slug")
      .executeTakeFirst();

    return event?.slug || false;
  }
  return false;
};

export const endInPersonEvent = async ({
  id,
  endTime
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
        endTime: endTime
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
                  )
                ])
              )
          )
        ])
      )
      .executeTakeFirst();

    if (result.numUpdatedRows > 0) {
      return true;
    }
  }

  return false;
};

export const checkInToInPersonEvent = async ({
  eventId,
  eventLocation,
  userLocation,
  checkInTime,
  allowedRange
}: {
  checkInTime: string;
  userLocation: { lat: number; lng: number };
  eventLocation: { lat: number; lng: number };
  eventId: number;
  allowedRange: number;
}) => {
  if (
    !checkIfWithinRange({
      eventLocation,
      userLocation,
      rangeInMeters: allowedRange
    })
  ) {
    return "You are not within the allowed range to check in to this event.";
  }
  
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
        checkInTime: checkInTime,
        location: point({ x: userLocation.lat, y: userLocation.lng })
      })
      .returning("id")
      .executeTakeFirst();

    if (eventCheckIn && eventCheckIn.id) {
      return true;
    }
  }
  return false;
};
