import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, VideoIcon } from "lucide-react";
import ScheduleMeetingModal from "./schedule-meeting-modal";
import { Button } from "@repo/ui/button";
import Link from "next/link";

export default async function GroupSchedulePage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const session = await getServerSession();
  const email = session?.user?.email;

  const meetings = await dbClient
    .selectFrom("Meeting")
    .selectAll()
    .where("groupId", "=", groupId)
    .where("date", ">=", new Date())
    .orderBy("date", "asc")
    .execute();

  const userRole = await dbClient
    .selectFrom("GroupMember")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select("GroupMember.role")
    .where("User.email", "=", email)
    .where("GroupMember.groupId", "=", groupId)
    .executeTakeFirst();

  const isOwnerOrAdmin = userRole?.role === "OWNER" || userRole?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
        {isOwnerOrAdmin && <ScheduleMeetingModal groupId={groupId} />}
      </div>

      <div className="grid gap-4">
        {meetings.length === 0 ? (
          <Card className="bg-secondary/20 border-dashed border-2">
            <CardContent className="py-10 text-center text-muted-foreground">
              No upcoming meetings scheduled.
            </CardContent>
          </Card>
        ) : (
          meetings.map((meeting) => (
            <Card key={meeting.id} className="bg-secondary/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">{meeting.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {meeting.isOnline ? (
                    <VideoIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <MapPinIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(meeting.date), "PPP")} at{" "}
                    {meeting.startTime ? format(new Date(meeting.startTime), "p") : "-"} - {" "}
                    {meeting.endTime ? format(new Date(meeting.endTime), "p") : "-"}
                  </div>
                  {meeting.agenda && (
                    <p className="text-sm line-clamp-2">
                      {typeof meeting.agenda === "string" ? meeting.agenda : JSON.stringify(meeting.agenda)}
                    </p>
                  )}
                  {meeting.meetLink && (
                    <div className="pt-2">
                      <Button asChild size="sm">
                        <Link href={meeting.meetLink} target="_blank">
                          Join Meeting
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
