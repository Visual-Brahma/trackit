"use client";

import type { LayoutProps } from "../../types";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export function Provider({ children }: LayoutProps) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}
