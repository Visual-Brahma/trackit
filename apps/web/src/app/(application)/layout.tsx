import Nav from "@/components/dashboard/nav";
import { SidebarNavProps } from "@/components/dashboard/nav/sidebar-nav";
import { UploadAttendanceReport } from "@/components/upload-attendance-report";
import { LayoutProps } from "@/types";
import {
  BookOpenTextIcon,
  CogIcon,
  FileBarChart2Icon,
  LayoutDashboardIcon,
  MessageCircleHeartIcon,
  SmartphoneNfcIcon,
  StickyNoteIcon,
  UsersIcon,
} from "lucide-react";
import Script from "next/script";

const sidebarNavItems: SidebarNavProps["itemGroups"] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />,
      },
      {
        title: "Groups",
        href: "/dashboard/groups",
        icon: <UsersIcon className="mr-2 h-4 w-4" />,
        badge: {
          text: "Coming soon",
        },
      },
      {
        title: "Reports",
        href: "/dashboard/reports",
        icon: <FileBarChart2Icon className="mr-2 h-4 w-4" />,
      },
      {
        title: "Notes",
        href: "/dashboard/notes",
        icon: <StickyNoteIcon className="mr-2 h-4 w-4" />,
        disabled: true,
        badge: {
          text: "Coming soon",
        },
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: <CogIcon className="mr-2 h-4 w-4" />,
      },
    ],
  },
  {
    title: "Help & Support",
    items: [
      {
        title: "Docs",
        href: "/guide",
        icon: <BookOpenTextIcon className="mr-2 h-4 w-4" />,
      },
      {
        title: "Contact Us",
        href: "/contact-us",
        icon: <SmartphoneNfcIcon className="mr-2 h-4 w-4" />,
      },
      {
        title: "Feedback",
        href: "/feedback",
        icon: <MessageCircleHeartIcon className="mr-2 h-4 w-4" />,
      },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="max-h-screen">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-2 md:space-y-0">
        <aside className="md:w-1/4 lg:w-1/5 xl:w-1/6 pt-4 px-6 md:p-0">
          <Nav itemGroups={sidebarNavItems} />
        </aside>
        <div className="flex-1 md:bg-secondary/40 p-2 sm:p-4 overflow-y-scroll">
          {children}
        </div>
        <Script src="https://trackit.statuspage.io/embed/script.js"></Script>
        <UploadAttendanceReport />
      </div>
    </div>
  );
}
