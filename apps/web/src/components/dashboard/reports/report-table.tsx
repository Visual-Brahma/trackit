"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Progress } from "@repo/ui/progress";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";

export interface AttendanceReportParticipant {
  id: string;
  name: string;
  joinTime: string;
  exitTime: string;
  attendancePercentage: number;
  avatar?: string;
}

export const attendanceReportParticipantsTableColumns: ColumnDef<AttendanceReportParticipant>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Participant Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={
                row.original.avatar ||
                `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${row.getValue(
                  "name",
                )}`
              }
            />
            <AvatarFallback>
              {(row.getValue("name") as string)
                .split(" ")
                .map((x) => x[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <p>{row.getValue("name")}</p>
        </div>
      ),
    },
    {
      id: "joinTime",
      accessorKey: "joinTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Join Time
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "Exit time",
      accessorKey: "exitTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Exit Time
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "attendancePercentage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attendance Percentage
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-2 max-w-sm">
          <Progress value={row.getValue("attendancePercentage")} />
          {row.getValue("attendancePercentage") + "%"}
        </div>
      ),
      enableHiding: false,
    },
  ];
