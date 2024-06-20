import { GroupNavbar } from "@/components/dashboard/groups/navbar";
import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";
import { dbClient } from "@/lib/db/db_client";
import { LayoutProps } from "@/types";
import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function GroupLayout({
  children,
  params: { groupId }
}: LayoutProps & {
  params: { groupId: string };
}) {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return <UnAuthenticatedUserError />;
  }

  const groupInfo = await dbClient
    .selectFrom("Group")
    .innerJoin("GroupMember", "Group.id", "GroupMember.groupId")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select(["Group.id", "Group.name", "Group.description", "GroupMember.role"])
    .where((eb) =>
      eb.and([eb("Group.id", "=", groupId), eb("User.email", "=", email)])
    )
    .executeTakeFirst();

  if (!groupInfo) {
    notFound();
  }

  const isOwnerOrAdmin=groupInfo.role==="OWNER"||groupInfo.role==="ADMIN";
  
  const groupNavbarItems=[
    {
      title: "Stream",
      href: `/g/${groupId}`
    },
    {
      title: "Attendance",
      href: `/g/${groupId}/attendance`
    },
    {
      title: "Schedule",
      href: `/g/${groupId}/schedule`
    },
    {
      title: "Members",
      href: `/g/${groupId}/members`
    },
  ];

  if(isOwnerOrAdmin){
    groupNavbarItems.push({
      title: "Settings",
      href: `/g/${groupId}/settings`
    });
  }

  return (
    <div>
      <TypographyH2>{groupInfo.name}</TypographyH2>
      <TypographyP className="my-2 max-w-lg">{groupInfo.description}</TypographyP>
      
      <GroupNavbar items={groupNavbarItems} />

      <div className="mt-2">{children}</div>
    </div>
  );
}
