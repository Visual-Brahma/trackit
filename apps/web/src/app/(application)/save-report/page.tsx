"use client"
import { TypographyH2, TypographyP } from "@repo/ui/typography";
import {useState, useEffect} from "react";
import {LoadingCircle} from "@repo/ui/icons";

const SaveAttendanceReportPage=() => {

    const [localStorageReportsCount, setLocalStorageReportsCount] = useState(0);

    useEffect(()=>{
        let reportsCount = 0;
        const query=RegExp('meet_attendance_report_');

        for (const item in window.localStorage) {
            if (window.localStorage.hasOwnProperty(item)) {
                if (item.match(query)||(!query&&typeof item==="string")) {
                    reportsCount++;
                }
            }
        }

        setLocalStorageReportsCount(reportsCount);
    },[]);
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-2 min-h-screen">
            <TypographyH2>Generating Attendance Report</TypographyH2>
            <TypographyP>Please don't close or refresh this tab. It will just take a few seconds.</TypographyP>
            <TypographyP>Reports in localStorage: {localStorageReportsCount} </TypographyP>
            <LoadingCircle />
        </div>
    );
}
export default SaveAttendanceReportPage;