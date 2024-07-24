import { Point } from "@/types";
import { buttonVariants } from "@repo/ui/button";
import { TypographyP } from "@repo/ui/typography";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import InPersonEventAttendance from "./location";
import { CheckCircleIcon } from "lucide-react";

export default function PageAction({
  email,
  event,
  hasCheckedIn,
}: {
  email: string | null | undefined;
  event: {
    slug: string;
    id: number;
    name: string;
    venue: string | null;
    location: Point;
    allowedRange: number;
    allowedEmailDomains: string[];
    allowedEmails: string[];
    startTime: Date;
    endTime: Date | null;
  };
  hasCheckedIn: boolean;
}) {
  if (event.endTime && event.endTime < new Date()) {
    return (
      <div>
        <TypographyP className="mb-4">
          This event has already ended.
        </TypographyP>
        <Link href={`/dashboard/in-person`} className={buttonVariants()}>
          Create your own event
        </Link>
      </div>
    );
  }

  if (!email) {
    return (
      <div>
        <TypographyP className="mb-4">
          You must be signed in to check-in to this event.
        </TypographyP>
        <Link
          href={`/api/auth/signin?callback=/in-person/${event.slug}`}
          className={buttonVariants()}
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const hasAccess =
    event.allowedEmails.length > 0
      ? event.allowedEmails.includes(email) ||
        event.allowedEmailDomains.some(
          (domain) => email.split("@")![1] == domain,
        )
      : event.allowedEmailDomains.length > 0
        ? event.allowedEmailDomains.some(
            (domain) => email.split("@")![1] == domain,
          )
        : true;

  if (!hasAccess) {
    return (
      <div>
        <TypographyP className="mb-4 text-destructive">
          You do not have access to this event.
        </TypographyP>
        <Link href={`/dashboard/in-person`} className={buttonVariants()}>
          Create your own Event
        </Link>
      </div>
    );
  }

  if (hasCheckedIn) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          <CheckCircleIcon className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            You have already checked in to the event.
          </AlertDescription>
        </Alert>
        <Link href={`/dashboard/in-person`} className={buttonVariants()}>
          Create your own Event
        </Link>
      </div>
    );
  }

  return (
    <InPersonEventAttendance
      eventId={event.id}
      allowedRange={event.allowedRange}
      eventLocation={{ lat: event.location.x, lng: event.location.y }}
    />
  );
}
