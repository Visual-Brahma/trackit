import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { AttendanceReportInfo } from "@/components/dashboard/reports/info";
import AttendanceReportShareView from "@/components/dashboard/reports/share";
import AttendanceReportTable from "@/components/dashboard/reports/report-table";
import { getServerSession } from "next-auth";
// import { dbClient } from "@/lib/db/db_client";

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

    // TODO: Fetch attendance report data from the database
    // fetch report based on groupId and slug, check if the user has access to the report
    // user can access the report if they are the member of the group to which the report belongs or if the report is shared with them


    const attendanceReport={
        isPublic: false,
        info: {
            meetcode: "meet-1",
            date: new Date("2021-10-01"),
            startTimestamp: "10:00 AM",
            endTimestamp: "11:30 AM",
            duration: "1h 30m",
            participantsCount: 20
        },
        data: [

        ],
        people: [

        ]
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
                        downloadData={attendanceReport.data}
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