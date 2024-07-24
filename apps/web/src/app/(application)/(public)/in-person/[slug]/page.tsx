import { dbClient } from "@/lib/db/db_client";
import { TypographyH1, TypographyH3 } from "@repo/ui/typography";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PageAction from "./action";
import Logo from "@/components/logo";
import { Badge } from "@repo/ui/badge";
import { buttonVariants } from "@repo/ui/button";
import { TypographyP } from "@repo/ui/typography";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function InPersonEventAttendancePublicPage({
  params: { slug }
}: {
  params: { slug: string };
}) {
  const event = await dbClient
    .selectFrom("InPersonEvent")
    .select([
      "id",
      "name",
      "venue",
      "slug",
      "location",
      "startTime",
      "endTime",
      "allowedEmails",
      "allowedEmailDomains",
      "allowedRange"
    ])
    .where("slug", "=", slug)
    .executeTakeFirst();

  if (!event) {
    notFound();
  }

  const session = await getServerSession();
  const email = session?.user?.email;

  let hasCheckedIn = false;

  if (email) {
    const checkedIn = await dbClient
      .selectFrom("InPersonEventAttendee")
      .innerJoin("User", "User.id", "InPersonEventAttendee.userId")
      .select("User.email")
      .where((eb) =>
        eb.and([eb("eventId", "=", event.id), eb("User.email", "=", email)])
      )
      .executeTakeFirst();

    if (checkedIn) {
      hasCheckedIn = true;
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      <div className="w-1/3 xl:w-1/2 bg-secondary/50 hidden lg:flex flex-col items-center justify-between min-h-full p-16">
        <div className="flex h-16 w-full items-center">
          <Link
            className="flex items-center font-display text-2xl"
            href="/in-person"
          >
            <Logo />
            <p className="font-display text-2xl font-bold drop-shadow-sm md:text-3xl">
              Trackit{" "}
            </p>
            <Badge className={`ml-2 rounded-xl`}>In-Person Events</Badge>
          </Link>
        </div>
        <blockquote className="mt-auto">
          <TypographyP>
            &ldquo;Go beyond the headcount: Trackit tracks attendance for
            in-person events with pinpoint accuracy using location verification.
            Gain valuable insights, enforce location restrictions, and manage
            your event seamlessly – all with Trackit.&rdquo;
          </TypographyP>
        </blockquote>
      </div>
      <div className="flex-1">
        <div className="fixed top-0 w-full border-b backdrop-blur-xl z-30 transition-all">
          <div className="flex max-w-screen-lg lg:hidden h-16 w-full items-center justify-between px-8">
            <Link
              className="flex items-center font-display text-2xl"
              href="/in-person"
            >
              <Logo />
              <p className="font-display text-2xl font-bold drop-shadow-sm md:text-3xl">
                Trackit{" "}
              </p>
              <Badge className={`ml-2 rounded-xl`}>In-Person Events</Badge>
            </Link>
            <div className="hidden sm:flex items-center justify-center gap-1">
              <Link
                href="/dashboard/in-person/new"
                className={buttonVariants({ variant: "default" })}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create your event
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center lg:items-start p-4 sm:p-8 xl:p-16 justify-center min-h-full">
          <div className="space-y-2 mb-12">
            <TypographyH1>{event.name}</TypographyH1>
            <TypographyH3>{event.venue}</TypographyH3>
          </div>
          <PageAction email={email} event={event} hasCheckedIn={hasCheckedIn} />
        </div>
      </div>
    </div>
  );
}
