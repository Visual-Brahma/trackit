"use client"
import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { useState, useEffect } from "react";
import { LoadingCircle } from "@repo/ui/icons";
import { buttonVariants } from "@repo/ui/button";
import Link from "next/link";

const SaveAttendanceReportPage=() => {

    const [localStorageReportsCount, setLocalStorageReportsCount]=useState(0);

    useEffect(() => {
        let reportsCount=0;
        const query=RegExp('meet_attendance_report_');

        for (const item in window.localStorage) {
            if (window.localStorage.hasOwnProperty(item)) {
                if (item.match(query)||(!query&&typeof item==="string")) {
                    reportsCount++;
                }
            }
        }

        setLocalStorageReportsCount(reportsCount);
    }, []);
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-2 min-h-screen">
            {
                localStorageReportsCount>0? (
                    <>
                        <TypographyH2>Generating Attendance Report</TypographyH2>
                        <TypographyP>Please don't close or refresh this tab. It will just take a few seconds.</TypographyP>
                        <TypographyP>Reports in localStorage: {localStorageReportsCount} </TypographyP>
                        <LoadingCircle /></>
                ):(
                    <>
                        <TypographyH2>All Caught up!</TypographyH2>
                        <TypographyP>There are no reports in your browser localstorage to update.</TypographyP>
                        <TypographyP>Refresh this page if you think there should be an attendance report.</TypographyP>
                        <Link href="/" className={buttonVariants()}>Go to Dashboard</Link>
                    </>
                )
            }
        </div>
    );
}
export default SaveAttendanceReportPage;