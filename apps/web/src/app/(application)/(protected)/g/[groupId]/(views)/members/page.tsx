import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { dbClient } from "@/lib/db/db_client";
import { getServerSession } from "next-auth";
import GroupMemberActions from "./member-actions";

export default async function GroupInterface({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const session = await getServerSession();
  const email = session?.user?.email;

  const members = await dbClient
    .selectFrom("GroupMember")
    .innerJoin("User", "GroupMember.userId", "User.id")
    .select([
      "User.id",
      "User.name",
      "GroupMember.role",
      "User.image",
      "User.email",
    ])
    .where("groupId", "=", groupId)
    .execute();

  const current_user = members.find((member) => member.email === email)!;

  return (
    <Card className="bg-secondary border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Members</CardTitle>
        <Input
          placeholder="Search people"
          className="max-w-sm bg-gray-700 border-gray-600 text-gray-100"
        />
      </CardHeader>
      <CardContent>
        <Table className="mt-4 border rounded-lg">
          <TableHeader className="bg-primary/20">
            <TableRow>
              <TableHead className="text-primary-foreground hover:text-black">
                User
              </TableHead>
              <TableHead className="text-primary-foreground hover:text-black">
                Role
              </TableHead>
              {current_user.role === "ADMIN" ||
                (current_user.role === "OWNER" && (
                  <TableHead className="text-primary-foreground hover:text-black text-right">
                    Actions
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(({ role, name, id }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{role}</TableCell>
                {current_user.role === "ADMIN" ||
                  (current_user.role === "OWNER" && (
                    <TableCell className="flex items-center justify-end">
                      <GroupMemberActions
                        groupId={groupId}
                        user_id={id}
                        role={role}
                        current_user={{
                          id: current_user.id,
                          role: current_user.role,
                        }}
                      />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </CardContent>
    </Card>
  );
}
