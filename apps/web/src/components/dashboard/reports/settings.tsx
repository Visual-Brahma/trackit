"use client";

import { Button, buttonVariants } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { TypographyH3 } from "@repo/ui/typography";
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
import { useState } from "react";
import { deleteAttendanceReport } from "@/lib/api/reports";
import { toast } from "@repo/ui/sonner";
import { LoadingCircle } from "@repo/ui/icons";
import { useRouter } from "next/navigation";

interface AttendanceReportSettingsViewProps {
  groupId: string;
  slug: string;
}

export const AttendanceReportSettingsView = ({
  groupId,
  slug,
}: AttendanceReportSettingsViewProps) => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAttendanceReportDelete = async () => {
    setIsLoading(true);
    if (await deleteAttendanceReport(slug, groupId)) {
      toast.success("Report deleted successfully.");
      setIsLoading(false);
      router.push(`/dashboard/reports`);
      router.refresh();
    } else {
      toast.error("Failed to delete the report. Please try again later.");
    }
    setIsLoading(false);
  };
  return (
    <div>
      <TypographyH3>Delete</TypographyH3>
      <Card className="backdrop-blur-xl backdrop-opacity-60 my-6 bg-destructive/30 ring-2 w-full max-w-md px-2">
        <CardContent className="p-4 flex flex-col items-start justify-center space-y-2">
          <p className="text-sm text-left font-semibold">
            Deleting a report is an irreversible process. Once you delete a
            report, it cannot be recovered.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isloading}>
                {isloading ? <LoadingCircle /> : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to delete this report. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={handleAttendanceReportDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
