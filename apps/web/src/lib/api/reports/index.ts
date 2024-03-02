"use server"
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth"

export const toggleReportPublicStatus=async (slug: string, groupId: string, status: boolean) => {
    const session=await getServerSession();
    if (session&&session.user&&session.user.email) {
        const email=session.user.email;
        try {

            const report=await dbClient.selectFrom("AttendanceReport")
                .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
                .innerJoin("GroupMember", "GroupMember.groupId", "Meeting.groupId")
                .innerJoin("User", "User.id", "GroupMember.userId")
                .select("AttendanceReport.id")
                .where((eb) =>
                    eb.and([
                        eb("AttendanceReport.slug", "=", slug),
                        eb("User.email", "=", email),
                        eb("Meeting.groupId", "=", groupId),
                        eb.or([
                            eb("GroupMember.role", "=", "ADMIN"),
                            eb("GroupMember.role", "=", "OWNER"),
                        ])
                    ])
                )
                .executeTakeFirst();

            if (report) {
                const reportStatus=await dbClient.updateTable("AttendanceReport")
                    .set({
                        isPublic: status
                    })
                    .where("AttendanceReport.slug", "=", slug)
                    .executeTakeFirst();


                if (reportStatus.numUpdatedRows) {
                    return true;
                }
            }
        } catch (error) {
            console.error("Error updating report status:", error);
            return false;
        }
    }

    return false;
}

export const shareAttendanceReport=async (slug: string, groupId: string, newEmails: string[], oldEmails: string[]) => {

    const session=await getServerSession();
    if (session&&session.user&&session.user.email) {
        const email=session.user.email;
        try {

            const report=await dbClient.selectFrom("AttendanceReport")
                .innerJoin("Meeting", "Meeting.id", "AttendanceReport.meetingId")
                .innerJoin("GroupMember", "GroupMember.groupId", "Meeting.groupId")
                .innerJoin("User", "User.id", "GroupMember.userId")
                .select("AttendanceReport.id")
                .where((eb) =>
                    eb.and([
                        eb("AttendanceReport.slug", "=", slug),
                        eb("User.email", "=", email),
                        eb("Meeting.groupId", "=", groupId),
                        eb.or([
                            eb("GroupMember.role", "=", "ADMIN"),
                            eb("GroupMember.role", "=", "OWNER"),
                        ])
                    ])
                )
                .executeTakeFirst();

            if (report) {
                const shareStatus=await dbClient.updateTable("AttendanceReport")
                    .set({
                        sharedWith: [...newEmails, ...oldEmails]
                    })
                    .returning("sharedWith")
                    .where("AttendanceReport.slug", "=", slug)
                    .executeTakeFirst();

                if (shareStatus) {
                    // TODO: send email to those who have been shared with
                    return shareStatus.sharedWith;
                }
            }
        } catch (error) {
            console.error("Error sharing report:", error);
        }
    }
}