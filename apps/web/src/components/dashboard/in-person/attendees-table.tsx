"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { formatTime } from "@/lib/utils/format";

export interface InPersonEventAttendanceReportParticipant {
  email: string;
  name: string | null;
  image: string | null;
  checkInTime: Date;
}

export const inPersonEventAttendanceReportParticipantsTableColumns: ColumnDef<InPersonEventAttendanceReportParticipant>[] =
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
                row.original.image ||
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
      accessorKey: "email",
      header: "Email",
      enableHiding: false,
    },
    {
      id: "checkInTime",
      accessorKey: "checkInTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Check-In Time
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {formatTime(row.getValue("checkInTime") as Date) ?? "-"}
        </div>
      ),
    },
  ];
