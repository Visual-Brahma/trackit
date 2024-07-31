"use client";
import { formatDatetime, formatTime } from "@/lib/utils/format";
import { Table, TableBody, TableCell, TableRow } from "@repo/ui/table";
import StopAcceptingResponsesForm from "./end-link-form";
import CopyAttendanceLink from "./copy-link";
import { useEffect, useState } from "react";
import DownloadInPersonEventAttendance from "./download";
import Link from "next/link";
import { buttonVariants } from "@repo/ui/button";

export default function InPersonEventInfo({
  event,
  downloadData,
}: {
  event: {
    slug: string;
    id: number;
    name: string;
    venue: string | null;
    allowedEmailDomains: string[];
    date: Date;
    startTime: Date;
    endTime: Date | null;
    attendeesCount: number;
  };
  downloadData: {
    image: string | null;
    name: string | null;
    email: string;
    checkInTime: Date | null;
  }[];
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="max-w-lg mt-6">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Name</TableCell>
            <TableCell>{event.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Date</TableCell>
            <TableCell>
              {isClient ? formatDatetime(event.date) || "-" : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Start Time</TableCell>
            <TableCell>
              {isClient ? formatTime(event.startTime) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">End Time</TableCell>
            <TableCell>
              {event.endTime === null ? (
                <StopAcceptingResponsesForm id={event.id} />
              ) : isClient ? (
                formatTime(event.endTime)
              ) : (
                ""
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Venue</TableCell>
            <TableCell>{event.venue ?? "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Attendees</TableCell>
            <TableCell>{event.attendeesCount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Allowed Email Domains</TableCell>
            <TableCell>
              {event.allowedEmailDomains.length > 0
                ? event.allowedEmailDomains.join(", ")
                : "All"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Share Attendance Link</TableCell>
            <TableCell>
              <CopyAttendanceLink slug={event.slug} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Scan QR Code</TableCell>
            <TableCell>
              <Link
                href="/dashboard/in-person/scan"
                className={buttonVariants()}
              >
                Scan
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Download Report</TableCell>
            <TableCell>
              <DownloadInPersonEventAttendance
                downloadData={downloadData}
                info={event}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
