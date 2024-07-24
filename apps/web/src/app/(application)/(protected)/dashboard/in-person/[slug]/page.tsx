import {
  InPersonEventAttendanceReportParticipant,
  inPersonEventAttendanceReportParticipantsTableColumns,
} from "@/components/dashboard/in-person/attendees-table";
import ListTable from "@/components/dashboard/table";
import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";
import { dbClient } from "@/lib/db/db_client";
import { formatDatetime, formatTime } from "@/lib/utils/format";
import { Table, TableBody, TableCell, TableRow } from "@repo/ui/table";
import { getServerSession } from "next-auth";
import StopAcceptingResponsesForm from "./end-link-form";
import CopyAttendanceLink from "./copy-link";

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
      <div className="max-w-sm mt-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell>{inPersonEvent.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Date</TableCell>
              <TableCell>{formatDatetime(inPersonEvent.date) || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Start Time</TableCell>
              <TableCell>{formatTime(inPersonEvent.startTime)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">End Time</TableCell>
              <TableCell>
                {inPersonEvent.endTime === null ? (
                  <StopAcceptingResponsesForm id={inPersonEvent.id} />
                ) : (
                  formatTime(inPersonEvent.endTime)
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Venue</TableCell>
              <TableCell>{inPersonEvent.venue ?? "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Attendees</TableCell>
              <TableCell>{attendees.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Allowed Range</TableCell>
              <TableCell>{inPersonEvent.allowedRange} metres</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Allowed Email Domains
              </TableCell>
              <TableCell>
                {inPersonEvent.allowedEmailDomains.length > 0
                  ? inPersonEvent.allowedEmailDomains.join(", ")
                  : "All"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Share Attendance Link
              </TableCell>
              <TableCell>
                <CopyAttendanceLink slug={slug} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <ListTable<InPersonEventAttendanceReportParticipant>
        data={attendees}
        columns={inPersonEventAttendanceReportParticipantsTableColumns}
      />
    </>
  );
}
