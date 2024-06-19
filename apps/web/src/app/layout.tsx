import "@repo/ui/styles";
import "./globals.css";
import { Toaster } from "@repo/ui/sonner";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { LayoutProps } from "@/types";
import { PT_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider } from "@/components/layout/providers";
import { getServerSession } from "next-auth";
import { TidioUserInfo } from "@/components/layout/tidio";

const PTsansDisplay = PT_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trackit - Google Meet Attendance Tracker",
  description:
    "Introducing TrackIt - the ultimate Google Meet attendance tracker extension! Trackit takes the hassle out of tracking attendance by providing detailed reports on who attended your meetings and how much. With easy installation and seamless integration with Google Meet, TrackIt allows you to start tracking attendance immediately. Say goodbye to manual attendance taking and hello to effortless reporting with TrackIt. Try it now and streamline your virtual meetings!",
  metadataBase: new URL("https://trackit.visualbrahma.tech"),
  applicationName: "Trackit",
  keywords: ["trackit", "visual brahma", "attendance", "google meet"],
  creator: "Visual Brahma",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6B13FA",
};

declare global {
  interface Window {
    tidioChatApi: any;
  }
}

export default async function RootLayout({ children }: LayoutProps) {
  const session = await getServerSession();

  const userInfo = {
    email: session?.user?.email ?? undefined,
    name: session?.user?.name ?? undefined,
    distinct_id: session?.user?.email ?? undefined,
  };

  return (
    <html lang="en">
      <body className={PTsansDisplay.className}>
        <Provider>
          {children}
          <TidioUserInfo {...userInfo} />
        </Provider>
        <Toaster richColors position={"top-right"} />
        <Script
          src="//code.tidio.co/zyi8qkhaweop5tc4oenpsdstwnvcjw6j.js"
          async={true}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
