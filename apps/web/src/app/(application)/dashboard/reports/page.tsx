import { TypographyH2, TypographyP } from "@repo/ui/typography";
import { AttendanceReportItem, AttendanceReportsListTable } from "@/components/dashboard/reports/table";

const ReportsPage=async () => {

    const data: AttendanceReportItem[]=[
       
    ]

    return (
        <div>
            <TypographyH2>Attendance Reports</TypographyH2>
            <TypographyP className="my-4">View, share and download your attendance reports</TypographyP>

            <div className="mt-6">
                <AttendanceReportsListTable data={data} />
            </div>
        </div>
    )
}

export default ReportsPage;