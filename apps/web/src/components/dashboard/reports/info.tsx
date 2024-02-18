import { formatDatetime } from "@/lib/utils/format";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@repo/ui/table"

interface AttendanceReportInfoProps {
    meetcode: string;
    date: string;
    startTimestamp: string;
    endTimestamp: string;
    duration: string;
    participantsCount: number;
}

export const AttendanceReportInfo=({ meetcode, date, startTimestamp, endTimestamp, duration, participantsCount }: AttendanceReportInfoProps) => {
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
                        <TableCell>{formatDatetime(date)||"-"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Start Time</TableCell>
                        <TableCell>{startTimestamp}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">End Time</TableCell>
                        <TableCell>{endTimestamp}</TableCell>
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
    )
}