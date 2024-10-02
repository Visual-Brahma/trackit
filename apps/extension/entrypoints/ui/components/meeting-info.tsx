import { Group, MeetingState } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@repo/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";
import { MeetingNameForm } from "./name-edit-form";

interface MeetingInfoProps extends MeetingState {
  participants: number;
  groups: Group[];
  setMeetingState: Dispatch<SetStateAction<MeetingState>>;
}

export default function MeetingInfo({
  name,
  groups,
  meetCode,
  date,
  startTime,
  groupId,
  participants,
  setMeetingState,
}: MeetingInfoProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement>();

  const getDuration = (startTime: Date, currTime: Date) => {
    const diff = currTime.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0 && hours === 0) {
      return "Just started";
    } else if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const [duration, setDuration] = useState<string>(
    getDuration(startTime, new Date())
  );

  useEffect(() => {
    const updateDurationInterval = setInterval(() => {
      setDuration(getDuration(startTime, new Date()));
    }, 60000);
    // creates a portal container for radix ui select popover wrapper so that it renders inside the shadow dom
    const shadowRootBody = document.querySelector("trackit-attendance-ui")
      ?.shadowRoot?.firstElementChild?.children[1];
    if (shadowRootBody) {
      const container = document.createElement("div");
      shadowRootBody.appendChild(container);
      setPortalContainer(container);
      return () => {
        shadowRootBody.removeChild(container);
        clearInterval(updateDurationInterval);
      };
    } else {
      return () => clearInterval(updateDurationInterval);
    }
  }, []);

  return (
    <Card className="bg-secondary/20">
      <CardHeader className="pb-1">
        <CardTitle className="text-danger">Meeting Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Meet Name</TableCell>
              <TableCell>
                <MeetingNameForm
                  name={name}
                  setMeetingState={setMeetingState}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Meet Code</TableCell>
              <TableCell>{meetCode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Date</TableCell>
              <TableCell>{format(date, "MMM do, yyyy")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Start Time</TableCell>
              <TableCell>{format(startTime, "hh:mm b")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Duration</TableCell>
              <TableCell>{duration}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Participants</TableCell>
              <TableCell>{participants}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Group</TableCell>
              <TableCell className="max-w-24">
                {groupId ? (
                  <Select
                    onValueChange={(groupId) =>
                      setMeetingState((prev) => ({ ...prev, groupId }))
                    }
                    defaultValue={groupId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent container={portalContainer}>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  "Default Group"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
