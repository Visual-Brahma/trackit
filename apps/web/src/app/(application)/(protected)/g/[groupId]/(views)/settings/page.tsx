import GroupGeneralSettings from "./general-info-form";
import GroupJoinCodeSettings from "./join-code-form";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import DeleteGroup from "./delete-group";

export default async function GroupSettingsPage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const session = await getServerSession();
  const email = session?.user?.email;

  const groupInfo = await dbClient
    .selectFrom("Group")
    .innerJoin("GroupMember", "Group.id", "GroupMember.groupId")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select([
      "Group.id",
      "Group.name",
      "Group.description",
      "GroupMember.role",
      "Group.joinCode",
      "Group.isAcceptingMembers",
    ])
    .where((eb) =>
      eb.and([
        eb("Group.id", "=", groupId),
        eb("User.email", "=", email!),
        eb("GroupMember.role", "in", ["ADMIN", "OWNER"]),
      ]),
    )
    .executeTakeFirst();

  if (!groupInfo) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <GroupGeneralSettings
        name={groupInfo.name}
        description={groupInfo.description ?? ""}
        allowNewMembers={groupInfo.isAcceptingMembers}
        groupId={groupInfo.id}
      />

      <GroupJoinCodeSettings groupId={groupId} joinCode={groupInfo.joinCode} />

      <DeleteGroup groupId={groupId} />
    </div>
  );
}
