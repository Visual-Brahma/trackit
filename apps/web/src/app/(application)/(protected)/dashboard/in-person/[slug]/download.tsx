"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import csvDownload from "json-to-csv-export";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import { formatDatetime, formatTime } from "@/lib/utils/format";
import { Button } from "@repo/ui/button";

export default function DownloadInPersonEventAttendance({
  downloadData,
  info,
}: {
  downloadData: {
    image: string | null;
    name: string | null;
    email: string;
    checkInTime: Date | null;
  }[];
  info: {
    slug: string;
    name: string;
    venue: string | null;
    allowedEmailDomains: string[];
    date: Date;
    startTime: Date;
    endTime: Date | null;
    attendeesCount: number;
  };
}) {
  const downloadCsv = () => {
    csvDownload({
      filename: `trackit-report-${info.slug}.csv`,
      delimiter: ",",
      headers: ["Participant Name", "Email", "Check-In Time"],
      data: downloadData.map((row) => [
        row.name,
        row.email,
        row.checkInTime ? formatTime(row.checkInTime): "Not Checked-In",
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

    const title = "Trackit In Person Event Report";
    const headers = [["Participant Name", "Email", "Check-In Time"]];

    const data = downloadData.map((row) => [
      row.name,
      row.email,
      row.checkInTime ? formatTime(row.checkInTime): "Not Checked-In",
    ]);

    doc.text(title, 40, 40);
    autoTable(doc, {
      startY: 50,
      body: [
        ["Name", info.name],
        ["Venue", info.venue],
        ["Date", formatDatetime(info.date) || "-"],
        ["Start Time", formatTime(info.startTime)],
        ["End Time", info.endTime ? formatTime(info.endTime) : ""],
        ["Participants", info.attendeesCount],
        ["Allowed Email Domains", info.allowedEmailDomains.join(", ")],
      ],
    });
    autoTable(doc, {
      head: headers,
      body: data,
    });
    doc.save(`trackit-report-${info.slug}.pdf`);
  };
  return (
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
  );
}
