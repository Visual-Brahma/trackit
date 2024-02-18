import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { AttendanceReportItem, AttendanceReportsListTable } from "@/components/dashboard/reports/table";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import { extractMeetCodeFromLink, getDurationBetweenDates } from "@/lib/utils/format";

const ReportsPage=async () => {

    const session=await getServerSession();
    const email=session?.user?.email;

    if (!email) {
        return (
            <div>
                <TypographyH2>Attendance Reports</TypographyH2>
                <TypographyP className="my-4">There is something wrong here, can you try refreshing the page once.</TypographyP>
            </div>
        );
    }

    const attendanceReports=await dbClient.selectFrom("AttendanceReport")
        .innerJoin("Meeting", "AttendanceReport.meetingId", "Meeting.id")
        .select([
            "AttendanceReport.id", "AttendanceReport.slug",
            "Meeting.date", "Meeting.startTime", "Meeting.endTime",
            "Meeting.meetLink", "Meeting.groupId", "Meeting.isOnline",
            "Meeting.meetPlatform", "Meeting.name",
            (eb) =>
                eb.fn.count<number>(
                    eb.selectFrom("AttendanceReportUserPresence")
                        .select("AttendanceReportUserPresence.id")
                        .whereRef("AttendanceReportUserPresence.attendanceReportId", "=", "AttendanceReport.id")
                ).as("participantsCount"),
        ])
        .where("Meeting.groupId", "in",
            (eb) =>
                eb.selectFrom("GroupMember")
                    .select("GroupMember.groupId")
                    .where("GroupMember.userId", "=",
                        (eb) =>
                            eb.selectFrom("User")
                                .select("User.id")
                                .where("User.email", "=", email)
                    )
        ).execute();

    const data: AttendanceReportItem[]=attendanceReports.map((report) => ({
        id: report.id,
        meetCode: report.meetPlatform==="google_meet"? extractMeetCodeFromLink(report.meetLink??""):report.meetLink??"-",
        date: report.date,
        participantsCount: report.participantsCount,
        duration: report.startTime&&report.endTime? getDurationBetweenDates(report.startTime, report.endTime):"-",
        groupId: report.groupId,
        slug: report.slug,
    }));

    return (
        <div>
            <TypographyH2>Attendance Reports</TypographyH2>
            <TypographyP className="my-4">View, share and download your attendance reports</TypographyP>

            <div className="mt-6">
                <AttendanceReportsListTable data={data} />
            </div>
        </div>
    )
}

export default ReportsPage;