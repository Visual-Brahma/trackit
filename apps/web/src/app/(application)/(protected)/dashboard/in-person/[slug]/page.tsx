import {
  InPersonEventAttendanceReportParticipant,
  inPersonEventAttendanceReportParticipantsTableColumns,
} from "@/components/dashboard/in-person/attendees-table";
import ListTable from "@/components/dashboard/table";
import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import InPersonEventInfo from "./info";

export default async function InPersonEventAttendanceReportPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return <UnAuthenticatedUserError />;
  }

  const inPersonEvent = await dbClient
    .selectFrom("InPersonEvent")
    .select([
      "id",
      "slug",
      "name",
      "date",
      "startTime",
      "endTime",
      "venue",
      "location",
      "allowedEmailDomains",
      "allowedRange",
    ])
    .where((eb) =>
      eb.and([
        eb("slug", "=", slug),
        eb("groupId", "in", (eb) =>
          eb
            .selectFrom("GroupMember")
            .select("GroupMember.groupId")
            .where("GroupMember.userId", "=", (eb) =>
              eb
                .selectFrom("User")
                .select("User.id")
                .where("User.email", "=", email),
            ),
        ),
      ]),
    )
    .executeTakeFirst();

  if (!inPersonEvent) {
    return <div>Event not found</div>;
  }

  const attendees = await dbClient
    .selectFrom("InPersonEventAttendee")
    .innerJoin("User", "User.id", "InPersonEventAttendee.userId")
    .select([
      "User.email",
      "User.name",
      "User.image",
      "checkInTime",
      "location",
    ])
    .where("InPersonEventAttendee.eventId", "=", inPersonEvent.id)
    .execute();

  return (
    <>
      <InPersonEventInfo
        event={{ attendeesCount: attendees.length, ...inPersonEvent }}
        downloadData={attendees}
      />

      <ListTable<InPersonEventAttendanceReportParticipant>
        data={attendees}
        columns={inPersonEventAttendanceReportParticipantsTableColumns}
      />
    </>
  );
}
