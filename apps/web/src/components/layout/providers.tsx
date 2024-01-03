"use client";

import type { LayoutProps } from "../../types";
import { ThemeProvider } from "next-themes";

export function Provider({ children }: LayoutProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
}
