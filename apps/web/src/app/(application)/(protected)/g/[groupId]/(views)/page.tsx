import { dbClient } from "@/lib/db/db_client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { TypographyH3, TypographyP } from "@repo/ui/typography";
import { FileBarChart2Icon, UsersIcon, CalendarIcon } from "lucide-react";

const GroupStreamPage = async ({
  params: { groupId },
}: {
  params: { groupId: string };
}) => {
  const stats = await dbClient.transaction().execute(async (trx) => {
    const membersCount = await trx
      .selectFrom("GroupMember")
      .select(({ fn }) => fn.count<number>("id").as("count"))
      .where("groupId", "=", groupId)
      .executeTakeFirst();

    const reportsCount = await trx
      .selectFrom("AttendanceReport")
      .innerJoin("Meeting", "AttendanceReport.meetingId", "Meeting.id")
      .select(({ fn }) => fn.count<number>("AttendanceReport.id").as("count"))
      .where("Meeting.groupId", "=", groupId)
      .executeTakeFirst();

    const upcomingMeetingsCount = await trx
      .selectFrom("Meeting")
      .select(({ fn }) => fn.count<number>("id").as("count"))
      .where("groupId", "=", groupId)
      .where("date", ">=", new Date())
      .executeTakeFirst();

    return {
      members: membersCount?.count || 0,
      reports: reportsCount?.count || 0,
      meetings: upcomingMeetingsCount?.count || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Members</CardTitle>
            <UsersIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Attendance Reports</CardTitle>
            <FileBarChart2Icon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reports}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-500">Upcoming Meetings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.meetings}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/40">
        <CardHeader>
          <TypographyH3>Welcome to your Group Stream</TypographyH3>
        </CardHeader>
        <CardContent>
          <TypographyP>
            This is your central hub for tracking attendance, scheduling meetings, and managing group members.
            Use the tabs above to navigate through different features.
          </TypographyP>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupStreamPage;
