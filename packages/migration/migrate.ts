import { readFile } from "fs/promises"
import { AttendanceReport } from "./clean";
import ProgressBar from "progress";
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely'
import { DB, MeetingPlatform } from "./database.types";
import { config } from "dotenv";

config();

const dbClient=new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL
        })
    })
});

export const migrate=async () => {

    const migrationData=JSON.parse(await readFile("data/merged-data.json", "utf-8")) as {
        report: AttendanceReport[];
        user: {
            id: number;
            email: string;
            name: string;
        }
    }[];

    const dataMigrationProgress=new ProgressBar('  migrating [:bar] :rate/rps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: migrationData.length
    });

    for (const { report: reports, user } of migrationData) {

        if (reports.length===0) {
            dataMigrationProgress.tick();
            continue;
        };

        try {
            const userDataMigrationProgress=new ProgressBar(`  user: ${user.email} [:bar] :rate/bps :percent :etas`, {
                complete: '+',
                incomplete: ' ',
                width: 40,
                total: reports.length+1
            });

            // create the user account
            const newUser=await dbClient.insertInto("User").values({
                email: user.email,
                name: user.name
            })
                .returning(["id"])
                .executeTakeFirst();

            if (newUser) {
                userDataMigrationProgress.tick();
                const group=await dbClient.selectFrom("GroupMember")
                    .innerJoin("Group",
                        (join) =>
                            join.onRef("Group.id", "=", "GroupMember.groupId")
                                .on("Group.isDefault", "=", true)
                    )
                    .select("Group.id")
                    .where(eb =>
                        eb.and([
                            eb("GroupMember.userId", "=", newUser.id),
                            eb("GroupMember.role", "=", "OWNER")
                        ])
                    ).executeTakeFirst();

                if (!group) {
                    dataMigrationProgress.tick();
                    continue;
                }

                // create the meeting and attendance records
                for (const report of reports) {
                    await dbClient.transaction().execute(async (trx) => {

                        const meeting=await trx.insertInto("Meeting")
                            .values({
                                name: report.meeting.name,
                                date: report.meeting.date,
                                groupId: group.id,
                                meetLink: report.meeting.meetLink,
                                meetPlatform: MeetingPlatform.GOOGLE_MEET,
                                startTime: report.meeting.startTime,
                                endTime: report.meeting.endTime
                            })
                            .returning(["id"])
                            .executeTakeFirst();

                        return await trx.insertInto("AttendanceReport").values({
                            slug: report.oldSlug,
                            meetingId: meeting!.id,
                            isPublic: report.isPublic,
                            membersPresence: JSON.stringify(report.membersPresence)
                        }).execute();

                    });
                    userDataMigrationProgress.tick();
                }

            }
        } catch (error) {
            console.error(error);
            console.log(user)
        }

        dataMigrationProgress.tick();
    }

}