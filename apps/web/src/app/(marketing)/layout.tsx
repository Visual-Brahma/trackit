import { LayoutProps } from "@/types";
import BaseLayout from "@/components/layout/marketing-pages-layout";

export default async function RootLayout({
    children,
}: LayoutProps) {

    return (
        <BaseLayout>
            {children}
        </BaseLayout>
    )
}