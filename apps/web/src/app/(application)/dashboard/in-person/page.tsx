import {
  InPersonEventItem,
  inPersonEventsTableColumns
} from "@/components/dashboard/in-person/table";
import ListTable from "@/components/dashboard/table";
import EmptyContentPlaceholder from "@/components/empty-content-placeholder";
import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";
import { dbClient } from "@/lib/db/db_client";
import { buttonVariants } from "@repo/ui/button";
import { FileBarChart2Icon, PlusIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function OfflineAttendancePage() {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return <UnAuthenticatedUserError />;
  }

  const inPersonEvents = await dbClient
    .selectFrom("InPersonEvent")
    .select(["slug", "name", "date", "startTime", "endTime"])
    .where("groupId", "in", (eb) =>
      eb
        .selectFrom("GroupMember")
        .select("GroupMember.groupId")
        .where("GroupMember.userId", "=", (eb) =>
          eb
            .selectFrom("User")
            .select("User.id")
            .where("User.email", "=", email)
        )
    )
    .execute();

  inPersonEvents.sort((a, b) => {
    if (a.endTime === null && b.endTime !== null) {
      return -1;
    } else if (a.endTime !== null && b.endTime === null) {
      return 1;
    }
    return b.date.getTime() - a.date.getTime();
  });

  return (
    <>
      {inPersonEvents.length === 0 ? (
        <EmptyContentPlaceholder
          className="mt-8"
          message="You have no in-person attendance links, let's create one."
          icon={<FileBarChart2Icon />}
        >
          <Link href="/dashboard/in-person/new" className={buttonVariants()}>
            <PlusIcon className="sm:mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Create Attendance Link</span>
          </Link>
        </EmptyContentPlaceholder>
      ) : (
        <ListTable<InPersonEventItem>
          data={inPersonEvents}
          columns={inPersonEventsTableColumns}
        />
      )}
    </>
  );
}
