"use client";
import { toast } from "@repo/ui/sonner";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MemberRoleForm from "./member-role-form";
import { Button } from "@repo/ui/button";
import { Role } from "@/types/database.types";
import { LoadingCircle } from "@repo/ui/icons";
import { cn } from "@/lib/utils";
import { removeUserFromGroup } from "@/lib/api/groups";

export default function GroupMemberActions({
  user_id,
  groupId,
  current_user,
  role,
}: {
  user_id: string;
  groupId: string;
  role: Role;
  current_user: {
    id: string;
    role: Role;
  };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveUser = async () => {
    setIsLoading(true);
    const res = await removeUserFromGroup({ groupId, userId: user_id });
    if (res === true) {
      toast.success("User removed.");
      router.refresh();
    } else {
      toast.error(res);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-2">
      {current_user.id !== user_id && (
        <MemberRoleForm userId={user_id} groupId={groupId} role={role} />
      )}
      <Button
        disabled={isLoading}
        onClick={handleRemoveUser}
        variant={"destructive"}
      >
        {isLoading ? (
          <LoadingCircle className="mr-2 h-4 w-4" />
        ) : (
          <TrashIcon
            className={cn("h-4 w-4", current_user.id === user_id ? "mr-2" : "")}
          />
        )}
        <span>{current_user.id === user_id ? "Leave" : ""}</span>
      </Button>
    </div>
  );
}
