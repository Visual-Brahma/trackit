import { buttonVariants } from "@repo/ui/button";
import Link from "next/link";

const features: { id: number; title: string; description: string }[] = [
  {
    id: 1,
    title: "Restricted Range",
    description:
      "Define a range in metres to make sure the attendance is taken only when the attendee is in that physical range.",
  },
  {
    id: 2,
    title: "Secure",
    description: "We are working very sincerely to secure your data.",
  },
  {
    id: 3,
    title: "Restrict Email Domains",
    description:
      "You can restrict the email domains of the attendees. So only the attendees with the specified email domains can check-in the event.",
  },
  {
    id: 4,
    title: "Detailed Report",
    description: "Get detailed report of attendance for your in-person events.",
  },
  {
    id: 5,
    title: "Attendance History",
    description:
      "All your attendance reports are securely stored in our database. You can access them anytime.",
  },
  {
    id: 6,
    title: "Full Control",
    description:
      "You have full access to your every data saved in our database.",
  },
];

export default function InPersonEventsPage() {
  return (
    <div className="snap-y">
      <div
        className={
          "flex flex-col items-center justify-center h-screen snap-always snap-center"
        }
      >
        <h1
          className={
            "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-8 max-w-screen-md"
          }
        >
          Easy Check-Ins for In-Person Events
        </h1>
        <p
          className={
            "text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-screen-sm"
          }
        >
          Track attendance for your in-person events with ease. Get detailed
          reports on who attended, when and from where.
        </p>
        <Link href="/dashboard/in-person" className={buttonVariants()}>
          Create an Event
        </Link>
      </div>

      <div className="flex items-center justify-center min-h-screen snap-always snap-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 sm:p-24">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border-border border-2 drop-shadow-2xl hover:drop-shadow-lg"
            >
              <div className="p-8">
                <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md">
                  {feature.title}
                </h5>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 text-left max-w-screen-md">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          "flex flex-col items-center justify-center h-screen snap-always snap-center"
        }
      >
        <h1
          className={
            "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-8 max-w-screen-md"
          }
        >
          Get started with Trackit today
        </h1>
        <p
          className={
            "text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-screen-sm"
          }
        >
          Trackit provides deep insights of the attendance of online classes and
          in-person events with great analysis tools.
        </p>
        <Link href="/dashboard/in-person" className={buttonVariants()}>
          Create an Event
        </Link>
      </div>
    </div>
  );
}