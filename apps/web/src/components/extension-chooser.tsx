import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";

import { Button, buttonVariants } from "@repo/ui/button";
import Link from "next/link";

export const ExtensionDropdown = ({ className }: { className?: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size={"xl"} className={className}>
          Get Free Extension
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <Link href="https://microsoftedge.microsoft.com/addons/detail/trackit-meet-attendance/chidnckliojipjihhfmjdmehaglhplcl">
          <DropdownMenuItem>Microsoft Edge</DropdownMenuItem>
        </Link>
        <Link href="https://chromewebstore.google.com/detail/trackit-meet-attendance-t/aopejafeamijmefcoclhohoaggbfhcgh">
          <DropdownMenuItem>Google Chrome</DropdownMenuItem>
        </Link>
        <Link href="https://addons.mozilla.org/en-US/firefox/addon/trackit">
          <DropdownMenuItem>Mozilla Firefox</DropdownMenuItem>
        </Link>
        <Link href="https://chromewebstore.google.com/detail/trackit-meet-attendance-t/aopejafeamijmefcoclhohoaggbfhcgh">
          <DropdownMenuItem>Brave or Arc</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ExtensionChooser = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl sm:text-4xl md:text-7xl p-8">
      <Link
        href={"/dashboard"}
        className={buttonVariants({ variant: "default", size: "xl" })}
      >
        Get Started
      </Link>
      <ExtensionDropdown />
    </div>
  );
};

export default ExtensionChooser;
