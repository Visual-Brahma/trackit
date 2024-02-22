import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth"

export const toggleReportPublicStatus=async (slug: string, groupId: string, status: boolean) => {
    const session=await getServerSession();
    if (session&&session.user&&session.user.email) {
        const email=session.user.email;
        try {
            const reportStatus=await dbClient.updateTable("AttendanceReport")
                .innerJoin("Meeting", "AttendanceReport.meetingId", "Meeting.id")
                .set({
                    isPublic: status
                })
                .where("AttendanceReport.slug", "=", slug)
                .where("groupId", "=", groupId)
                .where((eb) =>
                    eb("Meeting.groupId", "in",
                        eb.selectFrom("GroupMember")
                            .select("GroupMember.groupId")
                            .where((eb) =>
                                eb.or([
                                    eb("GroupMember.role", "=", "ADMIN"),
                                    eb("GroupMember.role", "=", "OWNER"),
                                ])
                            )
                            .where("GroupMember.userId", "=",
                                eb.selectFrom("User")
                                    .select("User.id")
                                    .where("User.email", "=", email)
                            )
                    )
                )
                .executeTakeFirst();

            if (reportStatus.numUpdatedRows) {
                return true;
            }
        } catch (error) {
            console.error("Error updating report status:", error);
            return false;
        }
    }

    return false;
}