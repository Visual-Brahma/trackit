import { LayoutProps } from "@/types";
import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { Separator } from "@repo/ui/separator";
import { buttonVariants } from "@repo/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function InPersonAttendanceLayout({ children }: LayoutProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <TypographyH2>In-Person Attendance</TypographyH2>
          <TypographyP className="my-4">
            Take attendance for your in-person events.
          </TypographyP>
        </div>
        <Link href="/dashboard/in-person/new" className={buttonVariants()}>
          <PlusIcon className="sm:mr-2 h-5 w-5" />
          <span className="hidden sm:inline">Create Attendance Link</span>
        </Link>
      </div>
      <Separator />

      <div className="p-2">{children}</div>
    </div>
  );
}
