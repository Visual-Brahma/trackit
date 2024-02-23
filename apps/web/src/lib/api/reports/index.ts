"use server"
import environmentVariables from "@/config/environment";
import { sendEmail } from "@/emails";
import AttendanceReportSharedEmail from "@/emails/attendance-report-shared";
import { dbClient } from "@/lib/db/db_client";
import { renderAsync } from "@react-email/render";
import { getServerSession } from "next-auth"

export const toggleReportPublicStatus=async (slug: string, groupId: string, status: boolean) => {
    const session=await getServerSession();
    if (session&&session.user&&session.user.email) {
        const email=session.user.email;
        try {
            const reportStatus=await dbClient.updateTable("AttendanceReport")
                .set({
                    isPublic: status
                })
                .where("AttendanceReport.slug", "=", slug)
                .where((eb) =>
                    eb("AttendanceReport.meetingId", "=",
                        eb.selectFrom("Meeting").select("Meeting.id").where((eb) =>
                            eb("Meeting.groupId", "=",
                                eb.selectFrom("GroupMember")
                                    .select("GroupMember.groupId")
                                    .where((eb) =>
                                        eb.and([
                                            eb("GroupMember.groupId", "=", groupId),
                                            eb.or([
                                                eb("GroupMember.role", "=", "ADMIN"),
                                                eb("GroupMember.role", "=", "OWNER"),
                                            ])
                                        ])
                                    )
                                    .where("GroupMember.userId", "=",
                                        eb.selectFrom("User")
                                            .select("User.id")
                                            .where("User.email", "=", email)
                                    )
                            )
                        ))

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

export const shareAttendanceReport=async (slug: string, groupId: string, newEmails: string[], oldEmails: string[]) => {

    const session=await getServerSession();
    if (session&&session.user&&session.user.email) {
        const email=session.user.email;
        try {
            const shareStatus=await dbClient.updateTable("AttendanceReport")
                .set({
                    sharedWith: [...newEmails, ...oldEmails]
                })
                .returning("sharedWith")
                .where("AttendanceReport.slug", "=", slug)
                .where((eb) =>
                    eb("AttendanceReport.meetingId", "=",
                        eb.selectFrom("Meeting").select("Meeting.id").where((eb) =>
                            eb("Meeting.groupId", "=",
                                eb.selectFrom("GroupMember")
                                    .select("GroupMember.groupId")
                                    .where((eb) =>
                                        eb.and([
                                            eb("GroupMember.groupId", "=", groupId),
                                            eb.or([
                                                eb("GroupMember.role", "=", "ADMIN"),
                                                eb("GroupMember.role", "=", "OWNER"),
                                            ])
                                        ])
                                    )
                                    .where("GroupMember.userId", "=",
                                        eb.selectFrom("User")
                                            .select("User.id")
                                            .where("User.email", "=", email)
                                    )
                            )
                        ))

                )
                .executeTakeFirst();

            if (shareStatus) {
                await sendEmail({
                    bcc: newEmails,
                    subject: `${session.user.name||"Someone"} has shared an attendance report with you.`,
                    from: "Trackit <trackit.visualbrahma.tech>",
                    html: await renderAsync(AttendanceReportSharedEmail({ name: session.user.name||"Someone", url: `${environmentVariables.baseUrl}/g/${groupId}/r/${slug}` })),
                    text: await renderAsync(AttendanceReportSharedEmail({ name: session.user.name||"Someone", url: `${environmentVariables.baseUrl}/g/${groupId}/r/${slug}` }), { plainText: true }),
                });
                return shareStatus.sharedWith;
            }
        } catch (error) {
            console.error("Error sharing report:", error);
        }
    }
}