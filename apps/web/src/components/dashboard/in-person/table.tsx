"use client";
import { formatDatetime, formatTime } from "@/lib/utils/format";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { toast } from "@repo/ui/sonner";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface InPersonEventItem {
  name: string;
  slug: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
}

export const inPersonEventsTableColumns: ColumnDef<InPersonEventItem>[] = [
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
    header: "Event Name",
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
    id: "startTime",
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatTime(row.getValue("startTime") as Date) ?? "-"}
      </div>
    ),
  },
  {
    id: "endTime",
    accessorKey: "endTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.endTime === null
          ? "-"
          : formatTime(row.getValue("endTime") as Date) ?? "-"}
      </div>
    ),
  },

  {
    id: "view",
    header: "View Report",
    cell: ({ row }) => (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <Button
          variant={"secondary"}
          onClick={async () => {
            await navigator.clipboard.writeText(
              `${location.origin}/in-person/${row.original.slug}`,
            );
            toast.success("Link copied to clipboard");
          }}
        >
          Share
        </Button>
        <Link
          href={`/dashboard/in-person/${row.original.slug}`}
          className={buttonVariants()}
        >
          View
        </Link>
      </div>
    ),
    enableHiding: false,
  },
];
