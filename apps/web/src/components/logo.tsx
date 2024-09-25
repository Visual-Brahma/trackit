import { cn } from "@repo/ui/utils";
import Image from "next/image";
import logo from "@public/logo.webp";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      alt="Trackit logo"
      className={cn(className, "p-2 rounded-sm bg-transparent")}
      height={50}
      src={logo}
      style={{ color: "transparent" }}
      title="Trackit logo"
      width={50}
    />
  );
}
