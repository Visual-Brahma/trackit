import { TypographyH2, TypographyP } from "@repo/ui/typography";
import {
  AttendanceReportItem,
  AttendanceReportsListTable,
} from "@/components/dashboard/reports/table";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import {
  extractMeetCodeFromLink,
  getDurationBetweenDates,
} from "@/lib/utils/format";
import { MeetingPlatform } from "@/types/database.types";
import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";

const ReportsPage = async () => {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return <UnAuthenticatedUserError />;
  }

  const attendanceReports = await dbClient
    .selectFrom("AttendanceReport")
    .innerJoin("Meeting", "AttendanceReport.meetingId", "Meeting.id")
    .select((eb) => [
      "AttendanceReport.id",
      "AttendanceReport.slug",
      "Meeting.date",
      "Meeting.startTime",
      "Meeting.endTime",
      "Meeting.meetLink",
      "Meeting.groupId",
      "Meeting.isOnline",
      "Meeting.meetPlatform",
      "Meeting.name",
      eb
        .fn<number>("jsonb_array_length", ["membersPresence"])
        .as("participantsCount"),
    ])
    .where("Meeting.groupId", "in", (eb) =>
      eb
        .selectFrom("GroupMember")
        .select("GroupMember.groupId")
        .where("GroupMember.userId", "=", (eb) =>
          eb
            .selectFrom("User")
            .select("User.id")
            .where("User.email", "=", email),
        ),
    )
    .execute();

  const data: AttendanceReportItem[] = attendanceReports.map((report) => ({
    id: report.id,
    meetCode:
      report.meetPlatform === MeetingPlatform.GOOGLE_MEET
        ? extractMeetCodeFromLink(report.meetLink ?? "")
        : report.meetLink ?? "-",
    date: report.date,
    participantsCount: report.participantsCount,
    duration:
      report.startTime && report.endTime
        ? getDurationBetweenDates(report.startTime, report.endTime)[0]
        : "-",
    groupId: report.groupId,
    slug: report.slug,
  }));

  data.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  return (
    <div>
      <TypographyH2>Attendance Reports</TypographyH2>
      <TypographyP className="my-4">
        View, share and download your attendance reports
      </TypographyP>

      <div className="mt-6">
        <AttendanceReportsListTable data={data} />
      </div>
    </div>
  );
};

export default ReportsPage;
