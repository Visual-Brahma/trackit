"use client"

import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import csvDownload from "json-to-csv-export";
import { useState } from "react";
import { EmailChipsInput } from "@repo/ui/email-chips-input"
import { TypographyP } from "@repo/ui/typography";
import { Switch } from "@repo/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { shareAttendanceReport, toggleReportPublicStatus } from "@/lib/api/reports";
import { LoadingCircle } from "@repo/ui/icons";
import { AttendanceReportParticipant } from "./report-table";

interface AttendanceReportShareViewProps {
    groupId: string;
    slug: string;
    people: {
        email: string;
        avatar?: string;
        name?: string;
    }[];
    downloadData: AttendanceReportParticipant[];
    isPublic: boolean;
}

export const AttendanceReportShareView=({ groupId, slug, downloadData, isPublic, people }: AttendanceReportShareViewProps) => {
    const [isloading, setIsLoading]=useState<boolean>(false);
    const [emails, setEmails]=useState<string[]>([]);
    const [sharedWith, setSharedWith]=useState(people);
    const [isPublicReport, setIsPublicReport]=useState<boolean>(isPublic);

    const downloadCsv=() => {
        csvDownload({
            filename: `attendance-report-${slug}.csv`,
            delimiter: ',',
            headers: ["Participant Name", "Join Time", "Exit Time", "Attendance Percentage"],
            data: downloadData
        });
    }

    const handlePublicStatusChange=async () => {
        setIsLoading(true);
        if (await toggleReportPublicStatus(slug, groupId, !isPublicReport)) {
            setIsPublicReport(!isPublicReport);
        } else {
            toast.error("Failed to update report publci view status");
        }
        setIsLoading(false);
    }

    const handleAttendanceReportShare=async () => {
        setIsLoading(true);
        const response=await shareAttendanceReport(slug, groupId, emails, sharedWith.map(p => p.email));
        if (response) {
            setSharedWith(response.map(p => ({ email: p } as AttendanceReportShareViewProps["people"][0])));
            setEmails([]);
        } else {
            toast.error("Failed to share report");
        }
        setIsLoading(false);
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-start gap-2 my-4">
                <Button onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}/g/${groupId}/r/${slug}`);
                    toast.success("Link copied to clipboard");
                }}>
                    Copy Link
                </Button>
                <Button onClick={downloadCsv}>
                    Download (.csv)
                </Button>
            </div>
            <div className="flex items-center space-x-4 w-full justify-between max-w-md my-4">
                <TypographyP>Anyone with link can view</TypographyP>
                <div className="flex items-center justify-center gap-2">
                    <Switch
                        checked={isPublicReport}
                        onCheckedChange={handlePublicStatusChange} />
                    {isloading&&<LoadingCircle />}
                </div>
            </div>
            <div className="flex items-start gap-2 max-w-md w-full">
                <EmailChipsInput disabled={isloading} ignore={people.map(p => p.email)} emails={emails} setEmails={setEmails} />
                <div className="flex items-center justify-center gap-2">
                    <Button disabled={isloading||emails.length===0} onClick={handleAttendanceReportShare}>
                        Share
                    </Button>
                    {isloading&&<LoadingCircle />}
                </div>
            </div>

            <div className="max-w-md w-full mt-6">
                {
                    sharedWith.map(person => (
                        <div key={person.email} className="flex items-center justify-start space-x-2 my-4">
                            <Avatar>
                                <AvatarImage src={person.avatar||`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${person.email.split("@")[0]}`} />
                                <AvatarFallback>{person.name?.split(" ").map(x => x[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p>{person.name}</p>
                                <p className="text-muted-foreground">{person.email}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AttendanceReportShareView;