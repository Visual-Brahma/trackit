import { Card, CardContent } from "@repo/ui/card";
import { LayoutProps } from "@/types";
import { ReactNode } from "react";
import { cn } from "@repo/ui/utils";

export default function EmptyContentPlaceholder({
  children,
  message,
  icon,
  className,
}: LayoutProps & {
  message: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-dashed w-full p-16 my-4", className)}>
      <CardContent className="flex flex-col items-center justify-center">
        {icon}
        <p className="mb-4 mt-2 text-sm text-center text-muted-foreground">
          {message}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}
