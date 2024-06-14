import { LayoutProps } from "@/types";
import { redirect } from "next/navigation";

export default function Layout({ children }: LayoutProps) {
  if (process.env.NODE_ENV != "development") {
    redirect("/");
  }
  return children;
}
