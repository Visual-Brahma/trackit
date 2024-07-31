import { buttonVariants } from "@repo/ui/button";
import { TypographyP } from "@repo/ui/typography";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { CheckCircleIcon } from "lucide-react";
import SignInButton from "@/components/signin-button";
import RegisterToInPersonEventAction from "./register";
import InPersonEventQrCode from "./qr";

export default function PageAction({
  email,
  event,
  hasCheckedIn,
  hasRegistered,
  userId,
}: {
  email: string | null | undefined;
  event: {
    slug: string;
    id: number;
    name: string;
    venue: string | null;
    allowedEmailDomains: string[];
    allowedEmails: string[];
    startTime: Date;
    endTime: Date | null;
  };
  hasCheckedIn: boolean;
  hasRegistered: boolean;
  userId?: string;
}) {
  if (event.endTime && event.endTime < new Date()) {
    return (
      <div className="flex flex-col items-center justify-center lg:items-start">
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
      <div className="flex flex-col items-center justify-center lg:items-start">
        <TypographyP className="mb-4">
          You must be signed in to check-in to this event.
        </TypographyP>
        <SignInButton callbackUrl={`/in-person/${event.slug}`} />
      </div>
    );
  }

  const hasAccess =
    event.allowedEmails.length > 0
      ? event.allowedEmails.includes(email)
      : event.allowedEmailDomains.length > 0
        ? event.allowedEmailDomains.some(
            (domain) => email.split("@")![1] == domain
          )
        : true;

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center lg:items-start">
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
      <div className="flex flex-col items-center justify-center lg:items-start gap-4">
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

  if (hasRegistered && userId) {
    return (
      <div className="flex flex-col items-center justify-center lg:items-start gap-4">
        <InPersonEventQrCode eventId={event.id} userId={userId} />
        <TypographyP>
          Show this QR code to the event organizer to check-in.
        </TypographyP>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center lg:items-start gap-4">
      <RegisterToInPersonEventAction eventId={event.id} />
    </div>
  );
}
