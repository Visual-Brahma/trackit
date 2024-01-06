import { ReactNode } from "react";
import { cn } from "../lib/utils";

export function TypographyH1({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className&&className)}>
            {children}
        </h1>
    )
}
