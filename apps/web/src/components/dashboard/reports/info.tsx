import { formatDatetime, formatTime } from "@/lib/utils/format";
import { Table, TableBody, TableCell, TableRow } from "@repo/ui/table";

export interface AttendanceReportInfoProps {
  meetcode: string;
  date: Date;
  startTimestamp: Date;
  endTimestamp: Date;
  duration: string;
  participantsCount: number;
}

export const AttendanceReportInfo = ({
  meetcode,
  date,
  startTimestamp,
  endTimestamp,
  duration,
  participantsCount,
}: AttendanceReportInfoProps) => {
  return (
    <div className="max-w-sm mt-6">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Meetcode</TableCell>
            <TableCell>{meetcode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Date</TableCell>
            <TableCell>{formatDatetime(date) || "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Start Time</TableCell>
            <TableCell>{formatTime(startTimestamp)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">End Time</TableCell>
            <TableCell>{formatTime(endTimestamp)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Duration</TableCell>
            <TableCell>{duration}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Participants</TableCell>
            <TableCell>{participantsCount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
