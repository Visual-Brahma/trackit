"use client";

import type { LayoutProps } from "../types";
import BaseLayout from "./layout";
import { ThemeProvider } from "next-themes";

export function Provider({ children }: LayoutProps) {
    return (
        <ThemeProvider attribute="class">
            {
                /* TODO: Based on session change base layout
                ```
                session ? (
                        <AuthenticatedUserBaseLayout>
                            {children}
                        </AuthenticatedUserBaseLayout>
                    ) : (
                        <UnAuthenticatedUserBaseLayout>
                            {children}
                        </UnAuthenticatedUserBaseLayout>
                    )
                ```
              */
            }
            <BaseLayout>
                {children}
            </BaseLayout>
        </ThemeProvider>
    );
}
