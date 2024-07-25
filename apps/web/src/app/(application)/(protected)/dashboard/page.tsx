import {
  FeatureCard,
  FeatureCardProps,
} from "@/components/dashboard/feature-card";
import { UpdateNotes } from "@/components/dashboard/update-notes";
import { ExtensionDropdown } from "@/components/extension-chooser";
import { TypographyH2, TypographyH4 } from "@repo/ui/typography";
import { FileBarChart2Icon, StickyNoteIcon, UsersIcon } from "lucide-react";
import { getServerSession } from "next-auth";

const DashboardPage = async () => {
  const session = await getServerSession();

  const features: FeatureCardProps[] = [
    {
      title: "Attendance Reports",
      description:
        "Keep track of your attendance and generate reports for your meetings and classes.",
      icon: <FileBarChart2Icon className="mr-2 h-4 w-4" />,
      href: "/dashboard/reports",
    },
    {
      title: "Groups",
      description:
        "Create groups for your class, team, or organization and track meetings and attendance more effectively.",
      icon: <UsersIcon className="mr-2 h-4 w-4" />,
      href: "/dashboard/groups",
    },
    {
      title: "Notes",
      description:
        "Take notes in your meetings or later and keep track of your progress.",
      icon: <StickyNoteIcon className="mr-2 h-4 w-4" />,
      disabled: true,
    },
  ];

  return (
    <div>
      <TypographyH2>Dashboard</TypographyH2>
      <div className="my-6 p-2">
        <p>Welcome👋, {" " + session?.user?.name || ""}</p>
      </div>
      <TypographyH4 className="p-2">Try new features in Trackit</TypographyH4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
      <ExtensionDropdown className="mt-6 m-2 p-4" />
      <UpdateNotes />
    </div>
  );
};

export default DashboardPage;
