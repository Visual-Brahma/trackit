import { readFile, writeFile } from "fs/promises"
import { AttendanceReport } from "./clean";

export const mergeData=async () => {
    // Merge user, and attendance data into a single JSON file

    const cleanedUserData=JSON.parse(await readFile("data/cleaned-users.json", "utf-8"));
    const attendanceData=JSON.parse(await readFile("data/attendance-reports-v2.json", "utf-8"));

    const mergedData: {
        report: AttendanceReport[];
        user: {
            id: number;
            email: string;
            name: string;
        }
    }[]=[];

    cleanedUserData.map((user: { id: number; email: string; name: string }) => {
        const reports: AttendanceReport[]=[];
        attendanceData.map((report: AttendanceReport) => {
            if (report.userId===user.id) {
                reports.push(report);
            }
        });
        mergedData.push({
            report: reports,
            user: user
        });
    });

    await writeFile("data/merged-data.json", JSON.stringify(mergedData, null, 2));
    console.log("Merged data successfully.");
}