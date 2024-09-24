import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const groups = await dbClient
    .selectFrom("Group")
    .innerJoin("GroupMember", "Group.id", "GroupMember.groupId")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select(["Group.id", "Group.name", "Group.banner", "Group.description"])
    .where("User.email", "=", email)
    .execute();

  return NextResponse.json(groups);
}
