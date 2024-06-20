import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { AttendanceReportInfo } from "@/components/dashboard/reports/info";
import AttendanceReportShareView from "@/components/dashboard/reports/share";
import AttendanceReportTable, {
  AttendanceReportParticipant,
} from "@/components/dashboard/reports/report-table";
import { getServerSession } from "next-auth";
import { dbClient } from "@/lib/db/db_client";
import { notFound } from "next/navigation";
import {
  extractMeetCodeFromLink,
  formatTime,
  getDurationBetweenDates,
} from "@/lib/utils/format";
import { MeetingPlatform } from "@/types/database.types";
import { AttendanceReportSettingsView } from "@/components/dashboard/reports/settings";

const AttendanceReportViewPage = async ({
  params,
}: {
  params: { groupId: string; slug: string };
}) => {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return (
      <div>
        <TypographyH2>Attendance Report</TypographyH2>
        <TypographyP className="my-4">
          There is something wrong here, can you try refreshing the page once.
        </TypographyP>
      </div>
    );
  }

  const isOwnerOrAdmin = await dbClient
    .selectFrom("AttendanceReport")
    .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
    .innerJoin("GroupMember", "GroupMember.groupId", "Meeting.groupId")
    .innerJoin("User", "User.id", "GroupMember.userId")
    .select("AttendanceReport.id")
    .where((eb) =>
      eb.and([
        eb("AttendanceReport.slug", "=", params.slug),
        eb("User.email", "=", email),
        eb("Meeting.groupId", "=", params.groupId),
        eb.or([
          eb("GroupMember.role", "=", "ADMIN"),
          eb("GroupMember.role", "=", "OWNER"),
        ]),
      ]),
    )
    .executeTakeFirst();

  const report = await dbClient
    .selectFrom("AttendanceReport")
    .innerJoin("Meeting", "AttendanceReport.meetingId", "Meeting.id")
    .selectAll()
    .select(({ fn }) =>
      fn<number>("jsonb_array_length", ["membersPresence"]).as(
        "participantsCount",
      ),
    )
    .where((eb) =>
      eb.and([
        eb("Meeting.groupId", "=", params.groupId),
        eb("AttendanceReport.slug", "=", params.slug),
        eb.or([
          eb("AttendanceReport.isPublic", "=", true),
          eb("sharedWith", "@>", [[email]]),
          eb(
            "Meeting.groupId",
            "in",
            eb
              .selectFrom("GroupMember")
              .select("GroupMember.groupId")
              .where(
                "GroupMember.userId",
                "=",
                eb
                  .selectFrom("User")
                  .select("User.id")
                  .where("User.email", "=", email),
              ),
          ),
        ]),
      ]),
    )
    .executeTakeFirst();

  if (!report) {
    notFound();
  }

  const [meetingDuration, durationInSeconds] = getDurationBetweenDates(
    report.startTime!,
    report.endTime!,
  );

  const attendanceReportData: AttendanceReportParticipant[] = (
    report.membersPresence as {
      name: string;
      joinTime: string;
      leaveTime: string;
      avatarUrl?: string;
      attendedDuration: number;
    }[]
  ).map((participant, idx) => ({
    id: participant.name + idx,
    name: participant.name,
    joinTime: formatTime(participant.joinTime),
    exitTime: formatTime(participant.leaveTime),
    attendancePercentage: report.slug.startsWith("mac_")
      ? participant.attendedDuration
      : parseFloat(
          ((participant.attendedDuration / durationInSeconds) * 100).toFixed(2),
        ), // In v1 we used to store attendance percentage in db, but in v2 we calculate it on the fly
    avatar: participant.avatarUrl,
  }));

  const attendanceReport = {
    isPublic: report.isPublic,
    info: {
      meetcode:
        report.meetPlatform === MeetingPlatform.GOOGLE_MEET
          ? extractMeetCodeFromLink(report.meetLink ?? "")
          : report.meetLink ?? "-",
      date: report.date,
      startTimestamp: report.startTime!,
      endTimestamp: report.endTime!,
      duration: meetingDuration,
      participantsCount: report.participantsCount,
    },
    data: attendanceReportData,
    people: (report.sharedWith || ([] as { email: string }[])).map((email) => ({
      email,
    })),
  };

  return (
    <div>
      <TypographyH2>Attendance Report</TypographyH2>
      <TypographyP className="my-4">
        Your attendance report contains name, join time, and attendance
        percentage of all the attendees.
      </TypographyP>

      <Tabs defaultValue="report" className="my-6">
        <TabsList>
          <TabsTrigger value="report">Report</TabsTrigger>
          {isOwnerOrAdmin && <TabsTrigger value="share">Share</TabsTrigger>}
          <TabsTrigger value="info">Info</TabsTrigger>
          {isOwnerOrAdmin && (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="report">
          <AttendanceReportTable data={attendanceReport.data} />
        </TabsContent>
        {isOwnerOrAdmin && (
          <TabsContent value="share">
            <AttendanceReportShareView
              groupId={params.groupId}
              slug={params.slug}
              downloadData={attendanceReportData}
              people={attendanceReport.people}
              isPublic={attendanceReport.isPublic}
            />
          </TabsContent>
        )}
        <TabsContent value="info">
          <AttendanceReportInfo {...attendanceReport.info} />
        </TabsContent>
        {isOwnerOrAdmin && (
          <TabsContent value="settings">
            <AttendanceReportSettingsView
              groupId={params.groupId}
              slug={params.slug}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AttendanceReportViewPage;
