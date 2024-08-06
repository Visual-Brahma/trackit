"use client";

import type { LayoutProps } from "../../types";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Next13ProgressBar } from 'next13-progressbar';

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
        <Next13ProgressBar color="hsl(var(--primary))" />
      </ThemeProvider>
    </SessionProvider>
  );
}
