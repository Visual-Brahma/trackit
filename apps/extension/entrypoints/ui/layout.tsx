import { LayoutProps } from "@/types";
import ThemeProvider from "./providers/theme";
import AuthProvider from "./providers/auth";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: LayoutProps) {
  const [isInMeeting, setIsInMeeting] = useState(false);

  useEffect(() => {
    let checkIfMeetingStartedInterval: NodeJS.Timeout;

    const checkIfMeetingStarted = () => {
      const meetActionButtons = document.getElementsByClassName("NtU4hc");
      if (meetActionButtons.length === 0) {
        setIsInMeeting(false);
      } else {
        setIsInMeeting(true);
        clearInterval(checkIfMeetingStartedInterval);
      }
    };

    checkIfMeetingStartedInterval = setInterval(checkIfMeetingStarted, 1000);

    return () => clearInterval(checkIfMeetingStartedInterval);
  }, []);

  if (!isInMeeting) return null;

  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
