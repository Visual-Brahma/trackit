"use client";
import { Button, buttonVariants } from "@repo/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { motion } from "framer-motion";
import { deleteGroup } from "@/lib/api/groups/settings";
import { useState } from "react";
import { toast } from "@repo/ui/sonner";
import { useRouter } from "next13-progressbar";
import { LoadingCircle } from "@repo/ui/icons";

export default function DeleteGroup({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteGroup({ groupId });
    if (res.success) {
      toast.success(res.message);
      router.push("/dashboard/groups");
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className={"mt-4"}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 1.0, ease: "easeOut" },
        },
      }}
    >
      <Card className="bg-destructive/20 backdrop-blur-lg border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>
                {isLoading ? <LoadingCircle className="mr-2" /> : null}
                Delete Group
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-red-500">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting the group will move all its notes and attendance
                  reports to the default group. Chats, shared media and upcoming
                  meeting will be removed forever. All the links between
                  attendance reports will break.
                  <br />
                  <br />
                  This is an irreversible process, think once more before moving
                  ahead.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}
