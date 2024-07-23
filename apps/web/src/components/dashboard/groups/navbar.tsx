"use client";

import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface GroupNavbarProps {
  items: {
    title: string;
    href: string;
  }[];
}

export const GroupNavbar = ({ items }: GroupNavbarProps) => {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-center sm:justify-start w-full border-b borber-border my-4 overflow-x-auto px-2 sm:px-0">
      {items.map((item) => (
        <div
          key={item.href}
          className="flex flex-col items-center max-w-fit hover:bg-accent hover:text-accent-foreground transition-colors rounded-t-md"
        >
          <Link
            href={item.href}
            className={buttonVariants({ variant: "ghost" })}
          >
            {item.title}
          </Link>
          <div
            className={cn(
              "h-1 w-full rounded-t-full mt-1",
              pathname === item.href ? "bg-primary" : "bg-transparent",
            )}
          ></div>
        </div>
      ))}
    </div>
  );
};
