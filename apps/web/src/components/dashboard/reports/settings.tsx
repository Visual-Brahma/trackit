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
import { deleteAttendanceReport, moveAttendanceReport } from "@/lib/api/reports";
import { toast } from "@repo/ui/sonner";
import { LoadingCircle } from "@repo/ui/icons";
import { useRouter } from "next13-progressbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

interface AttendanceReportSettingsViewProps {
  groupId: string;
  slug: string;
  userGroups: { id: string; name: string }[];
}

export const AttendanceReportSettingsView = ({
  groupId,
  slug,
  userGroups,
}: AttendanceReportSettingsViewProps) => {
  const [isloading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
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

  const handleMoveReport = async (newGroupId: string) => {
    if (newGroupId === groupId) return;
    setIsMoving(true);
    const res = await moveAttendanceReport({
      slug,
      currentGroupId: groupId,
      newGroupId,
    });
    if (res.success) {
      toast.success(res.message);
      router.push(`/g/${newGroupId}/r/${slug}`);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsMoving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <TypographyH3>Move Report</TypographyH3>
        <Card className="my-6 bg-secondary/40 ring-1 ring-border w-full max-w-md px-2">
          <CardContent className="p-4 flex flex-col items-start justify-center space-y-4">
            <p className="text-sm text-left font-semibold text-muted-foreground">
              Move this report to another group where you are an admin or owner.
            </p>
            <Select onValueChange={handleMoveReport} disabled={isMoving}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select group to move to" />
              </SelectTrigger>
              <SelectContent>
                {userGroups
                  .filter((g) => g.id !== groupId)
                  .map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {isMoving && (
              <div className="flex items-center text-sm text-muted-foreground">
                <LoadingCircle className="mr-2 h-4 w-4" />
                Moving report...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};
