import { Button } from "@repo/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/card";
import { BackgroundGradient } from "@repo/ui/background-gradient"
import { TypographyH4 } from "@repo/ui/typography";
import { ReactNode } from "react";
import Link from "next/link";

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    href?: string;
    disabled?: boolean;
}

export const FeatureCard=({ title, description, icon, disabled, href }: FeatureCardProps) => {
    return (
        <BackgroundGradient className="rounded-xl h-full">
            <Card className="h-full">
                <CardHeader>
                    <div className="flex items-center justify-start">
                        <div className="flex items-center justify-center h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            {icon}
                        </div>
                        <TypographyH4>{title}</TypographyH4>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{description}</p>
                </CardContent>
                <CardFooter>
                    <Button disabled={disabled}>
                        <Link href={href||""}>
                            Try Now
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </BackgroundGradient>
    );
}