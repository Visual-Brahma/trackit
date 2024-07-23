"use client";

import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import csvDownload from "json-to-csv-export";
import { useState } from "react";
import { EmailChipsInput } from "@repo/ui/email-chips-input";
import { TypographyP } from "@repo/ui/typography";
import { Switch } from "@repo/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  shareAttendanceReport,
  toggleReportPublicStatus,
} from "@/lib/api/reports";
import { LoadingCircle } from "@repo/ui/icons";
import { AttendanceReportParticipant } from "./report-table";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AttendanceReportInfoProps } from "./info";
import { formatDatetime, formatTime } from "@/lib/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";

interface AttendanceReportShareViewProps {
  groupId: string;
  slug: string;
  people: {
    email: string;
    avatar?: string;
    name?: string;
  }[];
  downloadData: AttendanceReportParticipant[];
  reportInfo: AttendanceReportInfoProps;
  isPublic: boolean;
}

export const AttendanceReportShareView = ({
  groupId,
  slug,
  downloadData,
  isPublic,
  people,
  reportInfo,
}: AttendanceReportShareViewProps) => {
  const [isloading, setIsLoading] = useState<{
    loading: boolean;
    shareMode?: "public" | "email";
  }>({ loading: false });
  const [emails, setEmails] = useState<string[]>([]);
  const [sharedWith, setSharedWith] = useState(people);
  const [isPublicReport, setIsPublicReport] = useState<boolean>(isPublic);

  const downloadCsv = () => {
    csvDownload({
      filename: `trackit-report-${slug}.csv`,
      delimiter: ",",
      headers: [
        "Participant Name",
        "Join Time",
        "Exit Time",
        "Attendance Percentage",
      ],
      data: downloadData.map((row) => [
        row.name,
        row.joinTime,
        row.exitTime,
        `${row.attendancePercentage}%`,
      ]),
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "A4",
    });

    doc.setFontSize(15);

    const title = "Trackit Attendance Report";
    const headers = [
      ["Participant Name", "Join Time", "Exit Time", "Attendance Percentage"],
    ];

    const data = downloadData.map((row) => [
      row.name,
      row.joinTime,
      row.exitTime,
      `${row.attendancePercentage}%`,
    ]);

    doc.text(title, 40, 40);
    autoTable(doc, {
      startY: 50,
      body: [
        ["Meetcode", reportInfo.meetcode],
        ["Date", formatDatetime(reportInfo.date) || "-"],
        ["Start Time", formatTime(reportInfo.startTimestamp)],
        ["End Time", formatTime(reportInfo.endTimestamp)],
        ["Duration", reportInfo.duration],
        ["Participants", reportInfo.participantsCount],
      ],
    });
    autoTable(doc, {
      head: headers,
      body: data,
    });
    doc.save(`trackit-report-${slug}.pdf`);
  };

  const handlePublicStatusChange = async () => {
    setIsLoading({ loading: true, shareMode: "public" });
    if (await toggleReportPublicStatus(slug, groupId, !isPublicReport)) {
      setIsPublicReport(!isPublicReport);
    } else {
      toast.error("Failed to update report public view status");
    }
    setIsLoading({ loading: false });
  };

  const handleAttendanceReportShare = async () => {
    setIsLoading({ loading: true, shareMode: "email" });
    const response = await shareAttendanceReport(
      slug,
      groupId,
      emails,
      sharedWith.map((p) => p.email),
    );
    if (response) {
      setSharedWith(
        response.map(
          (p) => ({ email: p }) as AttendanceReportShareViewProps["people"][0],
        ),
      );
      setEmails([]);
    } else {
      toast.error("Failed to share report");
    }
    setIsLoading({ loading: false });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-start gap-2 my-4">
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(
              `${window.location.origin}/g/${groupId}/r/${slug}`,
            );
            toast.success("Link copied to clipboard");
          }}
        >
          Copy Link
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button> Download </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadCsv}>
              Download (.csv)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadPdf}>
              Download (.pdf)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-4 w-full justify-between max-w-md my-4">
        <TypographyP>Anyone with link can view</TypographyP>
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={isPublicReport}
            onCheckedChange={handlePublicStatusChange}
          />
          {isloading.loading && isloading.shareMode === "public" && (
            <LoadingCircle />
          )}
        </div>
      </div>
      <div className="flex items-start gap-2 max-w-md w-full">
        <EmailChipsInput
          disabled={isloading.loading && isloading.shareMode === "email"}
          ignore={people.map((p) => p.email)}
          emails={emails}
          setEmails={setEmails}
        />
        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={
              (isloading.loading && isloading.shareMode === "email") ||
              emails.length === 0
            }
            onClick={handleAttendanceReportShare}
          >
            Share
          </Button>
          {isloading.loading && isloading.shareMode === "email" && (
            <LoadingCircle />
          )}
        </div>
      </div>

      <div className="max-w-md w-full mt-6">
        {sharedWith.map((person) => (
          <div
            key={person.email}
            className="flex items-center justify-start space-x-2 my-4"
          >
            <Avatar>
              <AvatarImage
                src={
                  person.avatar ||
                  `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${
                    person.email.split("@")[0]
                  }`
                }
              />
              <AvatarFallback>
                {person.name
                  ?.split(" ")
                  .map((x) => x[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p>{person.name}</p>
              <p className="text-muted-foreground">{person.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceReportShareView;
