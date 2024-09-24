"use client";
import { joinGroup } from "@/lib/api/groups";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { LoadingCircle } from "@repo/ui/icons";
import { Input } from "@repo/ui/input";
import { toast } from "@repo/ui/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinGroupModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const router = useRouter();

  const handleJoinGroup = async () => {
    setIsLoading(true);
    const res = await joinGroup(joinCode);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
          <DialogDescription>
            Enter the join code to join a group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <Input
            placeholder="Enter join code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />

          <Button
            onClick={handleJoinGroup}
            className="w-full"
            disabled={isLoading || joinCode.length === 0}
          >
            {isLoading ? (
              <>
                <LoadingCircle />
                <span className="ml-2">Joining Group</span>
              </>
            ) : (
              "Join"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
