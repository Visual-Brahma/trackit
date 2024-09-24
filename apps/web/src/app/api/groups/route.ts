import environmentVariables from "@/config/environment";
import { dbClient } from "@/lib/db/db_client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://meet.google.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigins.join(", "),
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function GET(req: NextRequest) {
  const session = await getToken({
    req,
    secret: environmentVariables.auth.nextAuthSecret,
  });

  const email = session?.email;

  if (!email) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }

  const groups = await dbClient
    .selectFrom("Group")
    .innerJoin("GroupMember", "Group.id", "GroupMember.groupId")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select([
      "Group.id",
      "Group.name",
      "Group.banner",
      "Group.description",
      "Group.isDefault",
    ])
    .where("User.email", "=", email)
    .execute();

  return NextResponse.json(groups, {
    status: 200,
    headers: corsHeaders,
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
