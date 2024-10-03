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

export default function DeleteGroup({ groupId }: { groupId: string }) {
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
              <Button variant="destructive" disabled>
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
