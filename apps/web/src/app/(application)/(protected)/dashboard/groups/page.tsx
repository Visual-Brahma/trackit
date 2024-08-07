import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";
import { dbClient } from "@/lib/db/db_client";
import { Button, buttonVariants } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { getServerSession } from "next-auth";
import Link from "next/link";

const GroupsPage = async () => {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return <UnAuthenticatedUserError />;
  }

  const groups = await dbClient
    .selectFrom("Group")
    .innerJoin("GroupMember", "Group.id", "GroupMember.groupId")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select(["Group.id", "Group.name", "Group.banner", "Group.description"])
    .where("User.email", "=", email)
    .execute();

  return (
    <div>
      <TypographyH2>My Groups</TypographyH2>

      <div className="flex flex-col md:flex-row items-start justify-between gap-2">
        <TypographyP className="my-4 max-w-xl">
          Groups help you organise attendance reports with same participants.
          You can chat, schedule meetings, get better overview of attendance of
          members over time and more.
        </TypographyP>

        <div className="flex items-center justify-center gap-1">
          <Button>Create</Button>
          <Button>Join</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="w-full max-w-[354px] my-5 p-2 rounded-2xl"
          >
            <CardHeader>
              <CardTitle className="text-white text-left">
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="text-left">{group.description}</div>
            </CardContent>
            <CardFooter className="text-right flex pb-5 mr-5 my-2 flex-row-reverse rounded-2xl">
              {/* <Link href={`/g/${group.id}`} className={buttonVariants()}>
                View
              </Link> */}
              <Button disabled>View</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
