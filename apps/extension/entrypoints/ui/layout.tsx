import { LayoutProps } from "@/types";
import ThemeProvider from "./providers/theme";
import AuthProvider from "./providers/auth";

export default function RootLayout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
