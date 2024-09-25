import {
  AttendanceReportItem,
  attendanceReportItemsTableColumns,
} from "@/components/dashboard/reports/table";
import { dbClient } from "@/lib/db/db_client";
import {
  extractMeetCodeFromLink,
  getDurationBetweenDates,
} from "@/lib/utils/format";
import { MeetingPlatform } from "@/types/database.types";
import ListTable from "@/components/dashboard/table";

const GroupAttendanceReportsPage = async ({
  params: { groupId },
}: {
  params: { groupId: string };
}) => {
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
    .where("Meeting.groupId", "=", groupId)
    .execute();

  const data: AttendanceReportItem[] = attendanceReports.map((report) => ({
    id: report.id,
    meetCode:
      report.meetPlatform === MeetingPlatform.GOOGLE_MEET
        ? extractMeetCodeFromLink(report.meetLink ?? "")
        : (report.meetLink ?? "-"),
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
    <div className="mt-4">
      <ListTable<AttendanceReportItem>
        data={data}
        columns={attendanceReportItemsTableColumns}
      />
    </div>
  );
};

export default GroupAttendanceReportsPage;
