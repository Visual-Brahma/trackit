import { ReactNode } from "react";
import { initTheme, ThemeContext } from "./utils/theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={initTheme()}>
      {children}
    </ThemeContext.Provider>
  );
}
