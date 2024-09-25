import { serverEnv } from "@/config/env/server";
import { LayoutProps } from "@/types";
import { redirect } from "next/navigation";

export default function Layout({ children }: LayoutProps) {
  if (serverEnv.NODE_ENV != "development") {
    redirect("/");
  }
  return children;
}
