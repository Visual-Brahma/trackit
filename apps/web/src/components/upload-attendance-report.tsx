"use client"

import { saveAttendanceReport } from "@/lib/api/reports/upload";
import { toast } from "@repo/ui/sonner";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const UploadAttendanceReport=() => {

    const path=usePathname();
    const router=useRouter();

    useEffect(() => {
        const reports=[];
        const query=RegExp('meet_attendance_report_');

        for (const item in window.localStorage) {
            if (window.localStorage.hasOwnProperty(item)) {
                if (item.match(query)||(!query&&typeof item==="string")) {
                    const value=JSON.parse(window.localStorage.getItem(item)!);
                    for (let i=0; i<(value["participants"] as any[]).length; i++) {
                        delete (value["participants"] as any[])[i]["attendance"];
                    }
                    reports.push({
                        key: item,
                        data: value
                    });
                }
            }
        }

        reports.forEach(async (report) => {
            const response=await saveAttendanceReport(report.data);
            if (response) {
                window.localStorage.removeItem(report.key);

                if (path.startsWith("/save-report")) {
                    toast.success((
                        <div>
                            <p>Report saved successfully.</p>
                            <Button asChild>
                                <Link href={`/g/${response.groupId}/r/${response.slug}`}>View</Link>
                            </Button>
                        </div>
                    ));
                    router.push(`/g/${response.groupId}/r/${response.slug}`)
                }
            }
        });
    }, []);

    return <></>;

}