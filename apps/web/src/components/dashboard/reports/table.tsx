"use client";
import { formatDatetime } from "@/lib/utils/format";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface AttendanceReportItem {
  id: number;
  meetCode: string;
  date: Date;
  participantsCount: number;
  duration: string;
  groupId: string;
  slug: string;
}

export const attendanceReportItemsTableColumns: ColumnDef<AttendanceReportItem>[] =
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
      accessorKey: "meetCode",
      header: "Meet Code",
      enableHiding: false,
    },
    {
      id: "date",
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDatetime(row.getValue("date") as Date) ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Duration
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "participants",
      accessorKey: "participantsCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Participants
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "view",
      header: "View Report",
      cell: ({ row }) => (
        <Link
          href={`/g/${row.original.groupId}/r/${row.original.slug}`}
          className={buttonVariants()}
        >
          View
        </Link>
      ),
      enableHiding: false,
    },
  ];
