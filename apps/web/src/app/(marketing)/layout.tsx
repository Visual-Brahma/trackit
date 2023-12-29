import { LayoutProps } from "@/types";
import BaseLayout from "@/components/layout/index";

export default async function RootLayout({
    children,
}: LayoutProps) {

    return (
        <BaseLayout>
            {children}
        </BaseLayout>
    )
}