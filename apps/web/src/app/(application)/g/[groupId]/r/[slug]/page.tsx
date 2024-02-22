import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { AttendanceReportInfo } from "@/components/dashboard/reports/info";
import AttendanceReportShareView from "@/components/dashboard/reports/share";
import AttendanceReportTable, { AttendanceReportParticipant } from "@/components/dashboard/reports/report-table";
import { getServerSession } from "next-auth";
import { dbClient } from "@/lib/db/db_client";
import { notFound } from "next/navigation";
import { extractMeetCodeFromLink, formatTime, getDurationBetweenDates } from "@/lib/utils/format";
import { MeetingPlatform } from "@/types/database.types";

const AttendanceReportViewPage=async ({ params }: { params: { groupId: string, slug: string } }) => {

    const session=await getServerSession();
    const email=session?.user?.email;

    if (!email) {
        return (
            <div>
                <TypographyH2>Attendance Report</TypographyH2>
                <TypographyP className="my-4">There is something wrong here, can you try refreshing the page once.</TypographyP>
            </div>
        );
    }

    const report=await dbClient.selectFrom("AttendanceReport")
        .innerJoin("Meeting", "AttendanceReport.meetingId", "Meeting.id")
        .selectAll()
        .select(({ fn }) =>
            fn<number>("jsonb_array_length", ["membersPresence"]).as("participantsCount")
        )
        .where((eb) =>
            eb.and([
                eb("Meeting.groupId", "=", params.groupId),
                eb("AttendanceReport.slug", "=", params.slug),
                eb.or([
                    eb("AttendanceReport.isPublic", "=", true),
                    eb("sharedWith", "@>", [[email]]),
                    eb("Meeting.groupId", "in",
                        eb.selectFrom("GroupMember")
                            .select("GroupMember.groupId")
                            .where("GroupMember.userId", "=",
                                eb.selectFrom("User")
                                    .select("User.id")
                                    .where("User.email", "=", email)
                            )
                    )
                ])
            ])
        )
        .executeTakeFirst();

    if (!report) {
        notFound();
    }

    const [meetingDuration, durationInSeconds]=getDurationBetweenDates(report.startTime!, report.endTime!);

    const attendanceReportData: AttendanceReportParticipant[]=(report.membersPresence as {
        name: string;
        joinTime: string;
        leaveTime: string;
        avatarUrl?: string;
        attendedDuration: number;
    }[]).map((participant, idx) => (
        {
            id: participant.name+idx,
            name: participant.name,
            joinTime: formatTime(participant.joinTime),
            exitTime: formatTime(participant.leaveTime),
            attendancePercentage: parseFloat(((participant.attendedDuration/durationInSeconds)*100).toFixed(2)),
            avatar: participant.avatarUrl
        }
    ));
    console.log(report)
    console.log(attendanceReportData)

    const attendanceReport={
        isPublic: report.isPublic,
        info: {
            meetcode: report.meetPlatform===MeetingPlatform.GOOGLE_MEET? extractMeetCodeFromLink(report.meetLink??""):report.meetLink??"-",
            date: report.date,
            startTimestamp: report.startTime!,
            endTimestamp: report.endTime!,
            duration: meetingDuration,
            participantsCount: report.participantsCount
        },
        data: attendanceReportData,
        people: (report.sharedWith||[] as { email: string }[]).map((email) => ({ email }))
    }

    return (
        <div>
            <TypographyH2>Attendance Report</TypographyH2>
            <TypographyP className="my-4">Your attendance report contains name, join time, and attendance percentage of all the attendees.</TypographyP>

            <Tabs defaultValue="report" className="my-6">
                <TabsList>
                    <TabsTrigger value="report">Report</TabsTrigger>
                    <TabsTrigger value="share">Share</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="report">
                    <AttendanceReportTable data={attendanceReport.data} />
                </TabsContent>
                <TabsContent value="share">
                    <AttendanceReportShareView
                        groupId={params.groupId}
                        slug={params.slug}
                        downloadData={report.membersPresence as { [key: string]: string|number }[]}
                        people={attendanceReport.people}
                        isPublic={attendanceReport.isPublic}
                    />
                </TabsContent>
                <TabsContent value="info">
                    <AttendanceReportInfo {...attendanceReport.info} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AttendanceReportViewPage;